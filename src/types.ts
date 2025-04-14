type Nullable<T> = T | undefined;

/**
 * サポートする HTTP メソッド
 */
type HttpMethod = "get" | "post" | "put" | "delete";

/**
 * パスパラメータのスキーマ型
 */
type SchemaParams = Record<string, string | number>;

/**
 * クエリパラメータのスキーマ型
 */
type SchemaQueries = Record<
  string,
  boolean | number | string | null | bigint | undefined | (boolean | number | string | null | bigint | undefined)[]
>;

/**
 * エンドポイント URL 構築に必要なパラメータの基礎型
 */
export type Options = { params?: SchemaParams; queries?: SchemaQueries; hash?: string };

/**
 * エンドポイント文字列からパスパラメータを抽出し、それらをキーとするオブジェクト型を生成するユーティリティ型
 *
 * @example
 * ExtractParams<"/users/[userId]/posts/[postId]">
 * // { userId: string | number, postId: string | number }
 */
type ExtractParams<Endpoint extends string> = Endpoint extends `${string}[${infer Param}]${infer After}`
  ? { [K in Param]: string | number } & ExtractParams<After>
  : unknown;

/**
 * エンドポイント文字列からパスパラメータが存在するかを判定するユーティリティ型
 *
 * @example
 * HasParams<"/users/[id]">
 * // true
 *
 * HasParams<"/users">
 * // false
 */
type HasParams<Endpoint extends string> = keyof ExtractParams<Endpoint> extends never ? false : true;

/**
 * エンドポイント文字列に基づいて、メソッドが期待する引数の型を定義するヘルパー型。
 * - エンドポイントにパスパラメータ (`[param]`) が含まれる場合: `params` プロパティが必須
 * - エンドポイントにパスパラメータが含まれない場合: `params` プロパティは許可されない
 * - `queries` は常にオプショナル。
 *
 * @example
 * ExpectedOptions<"/users/[id]">
 * // { params: { id: string | number }; queries?: SchemaQueries }
 *
 * ExpectedOptions<"/users">
 * // { params?: never; queries?: SchemaQueries }
 */
type ExpectedOptions<Endpoint extends string> = HasParams<Endpoint> extends true
  ? { params: ExtractParams<Endpoint>; queries?: SchemaQueries; hash?: string }
  : { params?: never; queries?: SchemaQueries; hash?: string };

/**
 * Nullable なプロパティのみを抽出するユーティリティ型
 *
 * @example
 * PickNullable<{ required: string; optional?: string }>
 * // { optional?: string }
 */
type PickNullable<T> = {
  [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};

/**
 * Required なプロパティのみを抽出するユーティリティ型
 *
 * @example
 * PickRequired<{ required: string; optional?: string }>
 * // { required: string }
 */
type PickRequired<T> = {
  [P in keyof T as undefined extends T[P] ? never : P]: T[P];
};

/**
 * 必須プロパティがあるかを再帰的に判定するユーティリティ型
 *
 * @example
 * HasRequired<{ required: { optional?: string } }>
 * // true
 *
 * HasRequired<{ optional?: { required: string } }>
 * // true
 *
 * HasRequired<{ optional?: { optional?: string } }>
 * // false
 */
type HasRequired<T> = (
  T extends unknown[]
    ? false
    : T extends object
      ? keyof PickRequired<T> extends never
        ? HasRequired<T[keyof T]>
        : true
      : false
) extends false
  ? false
  : true;

/**
 * Nullable なプロパティを省略可能に(?を付与)するユーティリティ型
 *
 * @example
 * Optional<{ required: string; optional: Nullable<string> }>
 * // { required: string; optional?: string }
 */
type Optional<T> = {
  [K in keyof PickNullable<T>]?: T[K];
} & {
  [K in keyof PickRequired<T>]: T[K];
};

/**
 * スキーマ定義から実際の用途に合わせて必須のキーが再帰的になければ省略可能にするユーティリティ型
 *
 * @example
 * ActualOptions<{ queries: { search?: string; count?: number  } }>
 * // { queries?: { search?: string; count?: number } }
 *
 * ActualOptions<{ queries: { search: string; count?: number  } }>
 * // { queries: { search: string; count?: number } }
 */
type ActualOptions<Schema extends Options> = Omit<
  {
    [K in keyof Schema as HasRequired<Schema[K]> extends true ? K : never]: Optional<Schema[K]>;
  } & {
    [K in keyof Schema as HasRequired<Schema[K]> extends false ? K : never]?: Optional<Schema[K]>;
  },
  "hash"
> & {
  hash?: Schema["hash"];
};

/**
 * パスパラメータを適応した型に変換するユーティリティ型
 *
 * @example
 * ReplacePathParams<"/users/[userId]/posts/[postId]", { userId: "123"; postId: "456" }>
 * // "/users/123/posts/456"
 */
type ReplacePathParams<
  Path extends string,
  Params extends SchemaParams,
> = Path extends `${infer Before}[${infer Param}]${infer After}`
  ? Param extends keyof Params
    ? `${Before}${Params[Param]}${ReplacePathParams<After, Params>}`
    : never
  : Path;

/**
 * パスパラメータの有無に応じて型を変換するユーティリティ型
 *
 * @example
 * ApplyParams<"/users/[userId]", { userId: 123 }>
 * // "/users/123"
 *
 * ApplyParams<"/">
 * // "/"
 */
type ApplyParams<Path extends string, Params extends Nullable<ExtractParams<Path>>> = keyof Params extends never
  ? Path
  : Params extends SchemaParams
    ? ReplacePathParams<Path, Params>
    : Path;

/**
 * クエリパラメータの有無に応じて型を変換するユーティリティ型
 *
 * @example
 * ApplyQueries<"/", { required: string }>
 * // `/?${string}`
 *
 * ApplyQueries<"/", { optional?: string }>
 * // `/${string}`
 *
 * ApplyQueries<"/">
 * // "/"
 */
type ApplyQueries<Path extends string, Queries extends Nullable<SchemaQueries>> = keyof Queries extends never
  ? Path
  : Queries extends SchemaQueries
    ? `${Path}${HasRequired<Queries> extends true ? "?" : ""}${string}`
    : Path;

type ApplyHash<Path extends string, Hash extends Nullable<string>> = Hash extends string ? `${Path}#${Hash}` : Path;

/**
 * パスパラメータとクエリパラメータから期待する URL 型を特定するユーティリティ型
 *
 * @example
 * ExtractPath<"/users/[userId]", { userId: 123 }, { search: string }>
 * // `/users/123?${string}`
 */
type ExpectedPath<
  Path extends string,
  Params extends Nullable<ExtractParams<Path>> = undefined,
  Queries extends Nullable<SchemaQueries> = undefined,
  Hash extends Nullable<string> = undefined,
> = ApplyHash<ApplyQueries<ApplyParams<Path, Params>, Queries>, Hash>;

/**
 * エンドポイント定義とスキーマ定義から実際の URL 返却型を生成するユーティリティ型
 * スキーマ定義のうち、パスパラメータとクエリパラメータの有無に応じて型を絞り込む
 *
 * @example
 * ActualReturn<"/path/[param]", { params: { param: string }, queries: { q: string } }>
 * // `/path/${string}?${string}`
 *
 * ActualReturn<"/path/[param1]/to/[param2]", { params: { param1: string; param2: number } }>
 * // `/path/${string}/to/${number}`
 *
 * ActualReturn<"/path", { queries: { q: string } }>
 * // `/path?${string}`
 */
type ActualReturn<Path extends string, Options> = ExpectedPath<
  Path,
  Options extends { params: infer Params extends ExtractParams<Path> } ? Params : undefined,
  Options extends { queries?: infer Queries extends Nullable<SchemaQueries> } ? Queries : undefined,
  Options extends { hash: infer Hash extends string } ? Hash : undefined
>;

/**
 * 引数なし定義用の型エイリアス
 */
export type Empty = Nullable<Record<string, never>>;

/**
 * URL の構築に必要なパラメータを受け取り、URL を生成する関数の型
 * 定義したスキーマによって引数がどこまで省略可能かどうかを制御する
 */
type Method<BaseUrl extends string, Endpoint extends string, OptionsSchema> = OptionsSchema extends Empty
  ? // メソッド定義が空の場合は引数なしにする
    () => `${BaseUrl}${Endpoint}`
  : OptionsSchema extends Options
    ? // メソッド定義が空でない場合はメソッド定義に必須プロパティがあるか判定
      HasRequired<ActualOptions<OptionsSchema>> extends true
      ? // 必須プロパティがあれば引数を必須にする
        <Options extends ActualOptions<OptionsSchema>>(
          options: Options,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
      : // 必須プロパティがなければ引数を省略可能にする
        <Options extends ActualOptions<OptionsSchema>>(
          options?: Options,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
    : never;

export type ExpectedSchema<Schema> = {
  // エンドポイントは文字列のみ許容
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? {
        // Key: HTTP メソッドは get, post, put, delete から選択
        // Value: パスパラメータが params の定義と一致しなければ型エラーになり、queries は自由に定義可能
        [MethodKey in HttpMethod]?: ExpectedOptions<EndpointKey>;
      }
    : never;
};

export type ActualSchema<Schema, BaseUrl extends string> = {
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? {
        // スキーマのうちメソッド定義の中身を URL 生成関数に置き換えるので型を矯正する
        [MethodKey in keyof Schema[EndpointKey]]: Method<BaseUrl, EndpointKey, Schema[EndpointKey][MethodKey]>;
      }
    : never;
};
