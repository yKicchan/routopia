type Nullable<T> = T | undefined;

/**
 * Supported HTTP methods
 */
type HttpMethod = "get" | "post" | "put" | "delete";

/**
 * Schema type for path parameter
 */
type SchemaParam = string | number | ReadonlyArray<string | number> | undefined;

/**
 * Schema type for path parameters
 */
type SchemaParams = Record<string, SchemaParam>;

/**
 * Schema type of query parameters (non-object values only)
 */
type SchemaQueries = Record<
  string,
  | boolean
  | number
  | string
  | null
  | bigint
  | undefined
  | ReadonlyArray<boolean | number | string | null | bigint | undefined>
>;

/**
 * Schema type for URL construction parameters
 */
export type Options = { params?: SchemaParams; queries?: SchemaQueries; hash?: string };

/**
 * Utility type that extracts path parameters from an endpoint string and generates object types with those as keys
 *
 * @example
 * ExtractParams<"/users/[userId]/posts/[postId]">
 * // { userId: string | number, postId: string | number }
 *
 * ExtractParams<"/path/[...params]">
 * // { params: (string | number)[] }
 *
 * ExtractParams<"/path/[[...params]]">
 * // { params?: (string | number)[] }
 */
type ExtractParams<Endpoint extends string> = Endpoint extends `${infer Before}[[...${infer Param}]]${infer After}`
  ? { [K in Param]: Extract<SchemaParam, ReadonlyArray<unknown> | undefined> } & ExtractParams<Before> &
      ExtractParams<After>
  : Endpoint extends `${infer Before}[...${infer Param}]${infer After}`
    ? { [K in Param]: Extract<SchemaParam, ReadonlyArray<unknown>> } & ExtractParams<Before> & ExtractParams<After>
    : Endpoint extends `${string}[${infer Param}]${infer After}`
      ? { [K in Param]: Extract<SchemaParam, string | number> } & ExtractParams<After>
      : unknown;

/**
 * Utility type to determine if a path parameter exists from an endpoint string
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
 * Utility type that defines the type of arguments the method expects, based on the endpoint string.
 * - If the endpoint contains a path parameter (`[param]`): the `params` property is required
 * - If the endpoint does not contain a path parameter: the `params` property is not allowed
 * - `queries` are always optional.
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
 * Utility type to extract only nullable properties
 *
 * @example
 * PickNullable<{ required: string; optional?: string }>
 * // { optional?: string }
 */
type PickNullable<T> = {
  [P in keyof T as undefined extends T[P] ? P : never]: T[P];
};

/**
 * Utility type to extract only Required properties
 *
 * @example
 * PickRequired<{ required: string; optional?: string }>
 * // { required: string }
 */
type PickRequired<T> = {
  [P in keyof T as undefined extends T[P] ? never : P]: T[P];
};

/**
 * Utility type that recursively determines if a required property is present
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
  T extends ReadonlyArray<unknown>
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
 * Utility type that makes Nullable properties optional by adding `?` (optional modifier).
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
 * Utility type that makes all properties of an object readonly
 *
 * @example
 * ReadonlyProperties<{ array: string[] }>
 * // { readonly array: readonly string[] }
 */
type ReadonlyProperties<T> = {
  [K in keyof T]: Readonly<T[K]>;
};

/**
 * Converts schema definition into optional keys if it has no required fields.
 * Readonly is marked to accept as const arguments.
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
    [K in keyof Schema as HasRequired<Schema[K]> extends true ? K : never]: Optional<ReadonlyProperties<Schema[K]>>;
  } & {
    [K in keyof Schema as HasRequired<Schema[K]> extends false ? K : never]?: Optional<ReadonlyProperties<Schema[K]>>;
  },
  "hash"
> & {
  hash?: Schema["hash"];
};

/**
 * Utility type that joins an array of strings or numbers into a single string
 *
 * @example
 * JoinParams<["123", "456"]>
 * // "123/456"
 */
type JoinParams<T extends ReadonlyArray<unknown>> = T extends readonly [
  infer Head extends Extract<SchemaParam, string | number>,
  ...infer Tail extends ReadonlyArray<unknown>,
]
  ? Tail["length"] extends 0
    ? Head
    : `${Head}/${JoinParams<Tail>}`
  : "";

/**
 * Utility type that trims double slashes and trailing slash from a path string
 *
 * @example
 * TrimPath<"/path//to//resource/">
 * // "/path/to/resource"
 */
type TrimPath<Path extends string> = Path extends `${infer Before}//${infer After}`
  ? `${TrimPath<`${Before}/${After}`>}`
  : Path extends `${infer Before}/`
    ? `${Before}`
    : Path;

/**
 * Replace [param] in path with actual values
 *
 * @example
 * ReplacePathParams<"/users/[userId]/posts/[postId]", { userId: "123"; postId: "456" }>
 * // "/users/123/posts/456"
 *
 * ReplacePathParams<"/path/[...params]", { params: ["123", "456"] }>
 * // "/path/123/456"
 *
 * ReplacePathParams<"/path/[[...params]]", { params: ["123", "456"] }>
 * // "/path/123/456"
 */
type ReplacePathParams<
  Path extends string,
  Params extends SchemaParams,
> = Path extends `${infer Before}[[...${infer Param}]]${infer After}`
  ? Param extends keyof Params
    ? Params[Param] extends Extract<SchemaParam, ReadonlyArray<unknown>>
      ? `${ReplacePathParams<Before, Params>}${JoinParams<Params[Param]>}${ReplacePathParams<After, Params>}`
      : never
    : `${ReplacePathParams<Before, Params>}${ReplacePathParams<After, Params>}`
  : Path extends `${infer Before}[...${infer Param}]${infer After}`
    ? Param extends keyof Params
      ? Params[Param] extends Extract<SchemaParam, ReadonlyArray<unknown>>
        ? `${ReplacePathParams<Before, Params>}${JoinParams<Params[Param]>}${ReplacePathParams<After, Params>}`
        : never
      : never
    : Path extends `${infer Before}[${infer Param}]${infer After}`
      ? Param extends keyof Params
        ? Params[Param] extends Extract<SchemaParam, string | number>
          ? `${Before}${Params[Param]}${ReplacePathParams<After, Params>}`
          : never
        : never
      : Path;

/**
 * Utility type that removes optional catch-all parameters from the path
 *
 * @example
 * ExcludeOptionalCatchAll<"/path/[[...params]]">
 * // "/path/"
 */
type ExcludeOptionalCatchAll<Path extends string> = Path extends `${infer Before}[[...${string}]]${infer After}`
  ? `${Before}${ExcludeOptionalCatchAll<After>}`
  : Path;

/**
 * Applies path parameters if they exist
 *
 * @example
 * ApplyParams<"/users/[userId]", { userId: 123 }>
 * // "/users/123"
 *
 * ApplyParams<"/">
 * // "/"
 */
type ApplyParams<Path extends string, Params extends Nullable<Optional<ExtractParams<Path>>>> = TrimPath<
  keyof Params extends never
    ? ExcludeOptionalCatchAll<Path>
    : Params extends SchemaParams
      ? ReplacePathParams<Path, Params>
      : never
>;

/**
 * Applies query parameters if they exist
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

/**
 * Applies hash fragment if defined
 *
 * @example
 * ApplyHash<"/path", "hash">
 * // "/path#hash"
 *
 * ApplyHash<"/path">
 * // "/path"
 */
type ApplyHash<Path extends string, Hash extends Nullable<string>> = Hash extends string ? `${Path}#${Hash}` : Path;

/**
 * Combines path, queries, and hash into a fully typed URL string
 *
 * @example
 * ExtractPath<"/users/[userId]", { userId: 123 }, { search: string }>
 * // `/users/123?${string}`
 */
type ExpectedPath<
  Path extends string,
  Params extends Nullable<Optional<ExtractParams<Path>>> = undefined,
  Queries extends Nullable<SchemaQueries> = undefined,
  Hash extends Nullable<string> = undefined,
> = ApplyHash<ApplyQueries<ApplyParams<Path, Params>, Queries>, Hash>;

/**
 * Combines endpoint and schema definition to generate a concrete return type
 * Refine type according to the presence or absence of path and query parameters in the schema definition
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
  Options extends { params: infer Params extends Optional<ExtractParams<Path>> } ? Params : undefined,
  Options extends { queries?: infer Queries extends Nullable<SchemaQueries> } ? Queries : undefined,
  Options extends { hash: infer Hash extends string } ? Hash : undefined
>;

/**
 * Alias for methods with no parameters
 */
export type Empty = Nullable<Record<string, never>>;

/**
 * Function type that returns a URL string based on the schema definition
 * - Accepts parameters depending on whether required fields exist
 */
type Method<BaseUrl extends string, Endpoint extends string, OptionsSchema> = OptionsSchema extends Empty
  ? () => `${BaseUrl}${Endpoint}`
  : OptionsSchema extends Options
    ? HasRequired<ActualOptions<OptionsSchema>> extends true
      ? <Options extends ActualOptions<OptionsSchema>>(
          options: Options,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
      : <Options extends ActualOptions<OptionsSchema>>(
          options?: Options,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
    : never;

/**
 * Expected schema definition:
 * - Endpoint string as key
 * - Object of HTTP methods as values
 * - Each method can have its own schema definition
 */
export type ExpectedSchema<Schema> = {
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? Partial<Record<HttpMethod, ExpectedOptions<EndpointKey>>>
    : never;
};

/**
 * Actual schema returned from the function:
 * - Each method is replaced with a typed URL generator
 */
export type ActualSchema<Schema, BaseUrl extends string> = {
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? {
        [MethodKey in keyof Schema[EndpointKey]]: Method<BaseUrl, EndpointKey, Schema[EndpointKey][MethodKey]>;
      }
    : never;
};
