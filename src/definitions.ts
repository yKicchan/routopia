import queryString from "query-string";
import type { ActualSchema, Empty, ExpectedSchema, Options } from "./types";
import { replacePathParams } from "./utilities";

/**
 * エンドポイントのパラメータの型定義に利用するユーティリティ
 * @example
 * { id: schema.type as string }
 */
export const type: unknown = undefined;

/**
 * エンドポイントの各種メソッド(get, post, put, delete)にパラメータが不要な場合に利用するユーティリティ
 * @example
 * { get: schema.empty }
 */
export const empty: Empty = undefined;

/**
 * エンドポイントに必要なパラメータを受け取り URL を生成する実装を返す高階関数
 * @param endpoint エンドポイントのパス
 * @param baseUrl ベース URL
 * @example
 * const getUsersUrl = method("/users/[id]");
 * const url = getUsersUrl({ params: { id: "1" }, queries: { flag: true } });
 * console.log(url); // => "/users/1?flag=true"
 */
function method(endpoint: string, baseUrl = "") {
  return (options?: Options) => {
    const path = replacePathParams(endpoint, options?.params);
    const queries = options?.queries ? `?${queryString.stringify(options.queries)}` : "";
    const hash = options?.hash ? `#${options.hash}` : "";
    return `${baseUrl}${path}${queries}${hash}`;
  };
}

/**
 * エンドポイント定義（スキーマ）を受け取り、型安全な URL 生成関数群を含むオブジェクトを生成する
 * 定義段階から URL Path Parameter を自動で補完したり、利用時には型チェックによる渡し忘れなどを防ぐ
 *
 * @param schema スキーマ
 * @returns エンドポイントとそのメソッドに対応する URL 生成関数を持つオブジェクト
 * @example
 * const routes = schema.routes({
 *   // /users エンドポイントの定義例
 *   "/users": {
 *     get: {
 *       // クエリパラメータの定義
 *       queries: {
 *         ids: schema.type as string[],
 *         search: schema.type as string,
 *         count: schema.type as number,
 *         flag: schema.type as boolean,
 *         nullable: schema.type as Nullable<string>,
 *       }
 *     },
 *     // パラメータが不要な場合
 *     post: schema.empty
 *   },
 *   "/users/[id]": {
 *     get: {
 *       // パスパラメータの定義
 *       params: {
 *         id: schema.type as string,
 *       },
 *     },
 *   },
 * });
 */
export function routes<Schema extends ExpectedSchema<Schema>>(schema: Schema): ActualSchema<Schema, "">;
export function routes<Schema extends ExpectedSchema<Schema>, BaseUrl extends string>(
  schema: Schema,
  baseUrl: BaseUrl,
): ActualSchema<Schema, BaseUrl>;
export function routes<Schema extends ExpectedSchema<Schema>, BaseUrl extends string>(
  schema: Schema,
  baseUrl?: BaseUrl,
) {
  return Object.entries<object>(schema).reduce(
    (acc, [endpoint, methods]) =>
      Object.assign(acc, {
        [endpoint]: Object.keys(methods).reduce(
          (acc, methodKey) =>
            Object.assign(acc, {
              // 定義したスキーマのうちメソッド定義の中身を URL 生成関数に置き換える
              [methodKey]: method(endpoint, baseUrl),
            }),
          {},
        ),
      }),
    {},
  ) as ActualSchema<Schema, BaseUrl>;
}
