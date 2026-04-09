/**
 * Utility type to allow a type or undefined
 */
type Nullable<T> = T | undefined;

/**
 * Supported HTTP methods
 */
type HttpMethod = "get" | "post" | "put" | "delete";

/**
 * Schema type for primitive path parameter.
 */
export type SchemaPrimitiveParam = string | number;

/**
 * Schema type for array path parameter (catch-all segments).
 */
export type SchemaArrayParam = ReadonlyArray<SchemaPrimitiveParam>;

/**
 * Schema type for path parameter
 */
type SchemaParam = SchemaPrimitiveParam | SchemaArrayParam;

/**
 * Schema type for path parameters
 */
type SchemaParams = Record<string, SchemaParam>;

/**
 * Schema type for primitive query parameter.
 */
type SchemaPrimitiveQuery = boolean | number | string | null | bigint | undefined;

/**
 * Schema type for query parameter, which can be a primitive value or an array of primitive values.
 */
export type SchemaQuery = SchemaPrimitiveQuery | ReadonlyArray<SchemaPrimitiveQuery>;

/**
 * Schema type of query parameters (non-object values only)
 */
type SchemaQueries = Record<string, SchemaQuery>;

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
 * // { params: (string | number)[] }
 *
 * ExtractParams<"/path/[param]", true>
 * // { param?: string | number }
 */
type ExtractParams<
  Endpoint extends string,
  Mocking = false,
> = Endpoint extends `${infer Before}[[...${infer Param}]]${infer After}`
  ? (Mocking extends true ? { [K in Param]?: SchemaArrayParam } : { [K in Param]: SchemaArrayParam }) &
      ExtractParams<Before, Mocking> &
      ExtractParams<After, Mocking>
  : Endpoint extends `${infer Before}[...${infer Param}]${infer After}`
    ? (Mocking extends true ? { [K in Param]?: SchemaArrayParam } : { [K in Param]: SchemaArrayParam }) &
        ExtractParams<Before, Mocking> &
        ExtractParams<After, Mocking>
    : Endpoint extends `${string}[${infer Param}]${infer After}`
      ? (Mocking extends true ? { [K in Param]?: SchemaPrimitiveParam } : { [K in Param]: SchemaPrimitiveParam }) &
          ExtractParams<After, Mocking>
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
 * // { params: { id: string | number }; queries?: SchemaQueries; hash?: string }
 *
 * ExpectedOptions<"/users">
 * // { queries?: SchemaQueries; hash?: string }
 */
type ExpectedOptions<Endpoint extends string> = HasParams<Endpoint> extends true
  ? { params: ExtractParams<Endpoint>; queries?: Simplify<SchemaQueries>; hash?: string }
  : { queries?: Simplify<SchemaQueries>; hash?: string };

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
 * // { array: readonly string[] }
 */
type ReadonlyProperties<T> = {
  [K in keyof T]: Readonly<T[K]>;
};

// biome-ignore lint/complexity/noBannedTypes: Using empty object type for specific purpose
type EmptyObject = {};

/**
 * Utility type that generates the actual options type for the method based on the schema definition and endpoint string.
 * Please refer to each ActualXXXX type for more details.
 */
type ActualOptions<
  Schema extends Options,
  Endpoint extends string,
  Mocking = false,
> = (Schema["params"] extends Options["params"] ? ActualParams<Schema["params"], Endpoint, Mocking> : EmptyObject) &
  (Schema["queries"] extends Options["queries"] ? ActualQueries<Schema["queries"], Mocking> : EmptyObject) &
  (Schema["hash"] extends Options["hash"] ? ActualHash<Schema["hash"], Mocking> : EmptyObject);

/**
 * Makes path parameters optional if they are defined as optional catch-all segments in the endpoint string.
 * - If Mocking is true, it allows any value for path parameters.
 *
 * @example
 * ActualParams<{ param1: string; param2: string[] }, "/[param1]/[[...param2]]">
 * // { params: { param1: string; param2?: string[] } }
 *
 * ActualParams<{ param: string[] }, "/[[...param]]">
 * // { params?: { param?: string[] } }
 *
 * ActualParams<{ param: string }, "/[param]", true>
 * // { params?: { param?: SchemaParam } }
 */
type ActualParams<Schema extends Options["params"], Endpoint extends string, Mocking = false> = Mocking extends true
  ? {
      params?: Simplify<
        {
          [K in keyof Schema as K extends CatchAllSegments<Endpoint> ? K : never]?: SchemaArrayParam;
        } & {
          [K in keyof Schema as K extends CatchAllSegments<Endpoint> ? never : K]?: SchemaPrimitiveParam;
        }
      >;
    }
  : {
        [K in keyof Schema as K extends OptionalCatchAllSegments<Endpoint> ? K : never]?: Readonly<Schema[K]>;
      } & {
        [K in keyof Schema as K extends OptionalCatchAllSegments<Endpoint> ? never : K]: Readonly<Schema[K]>;
      } extends infer R
    ? HasRequired<R> extends true
      ? { params: R }
      : { params?: R }
    : never;

/**
 * Makes query parameters deeply optional if there are no required fields.
 * - If Mocking is true, it allows any value for queries.
 *
 * @example
 * ActualQueries<{ required: string; optional?: number }>
 * // { queries: { required: readonly string; optional?: readonly number } }
 *
 * ActualQueries<{ optional1?: string; optional2?: number }>
 * // { queries?: { optional1?: readonly string; optional2?: readonly number } }
 *
 * ActualQueries<{ str: string; num?: number }, true>
 * // { queries?: { str?: SchemaQueries[string]; num?: SchemaQueries[string] } }
 */
type ActualQueries<Schema extends Options["queries"], Mocking = false> = Optional<
  ReadonlyProperties<Schema>
> extends infer R
  ? Mocking extends true
    ? {
        queries?: {
          [K in keyof R]?: SchemaQuery;
        };
      }
    : HasRequired<R> extends true
      ? { queries: R }
      : { queries?: R }
  : never;

/**
 * Keeps hash as is, since it's always optional in the schema definition.
 * - If Mocking is true, it allows any string value for hash.
 *
 * @example
 * ActualHash<"hash">
 * // { hash?: "hash" }
 *
 * ActualHash<"hash", true>
 * // { hash?: string }
 */
type ActualHash<Schema extends Options["hash"], Mocking = false> = Mocking extends true
  ? { hash?: string }
  : { hash?: Schema };

/**
 * Utility type that extracts optional catch-all parameter names from an endpoint string
 *
 * @example
 * OptionalCatchAllSegments<"/path/[[...params]]/[id]/[[...moreParams]]">
 * // "params" | "moreParams"
 */
type OptionalCatchAllSegments<T extends string> = T extends `${string}[[...${infer Param}]]${infer After}`
  ? Param | OptionalCatchAllSegments<After>
  : never;

/**
 * Utility type that extracts catch-all parameter names from an endpoint string
 *
 * @example
 * CatchAllSegments<"/path/[...params]/[id]/[[...moreParams]]">
 * // "params" | "moreParams"
 */
type CatchAllSegments<T extends string> = T extends `${string}[...${infer Param}]${infer After}`
  ? Param | CatchAllSegments<After>
  : never;

/**
 * Utility type that joins an array of strings or numbers into a single string
 *
 * @example
 * JoinParams<["123", "456"]>
 * // "123/456"
 */
type JoinParams<T extends ReadonlyArray<unknown>> = T extends readonly [
  infer Head extends SchemaPrimitiveParam,
  ...infer Tail extends ReadonlyArray<unknown>,
]
  ? Tail["length"] extends 0
    ? Head
    : `${Head}/${JoinParams<Tail>}`
  : T extends SchemaArrayParam
    ? T[number]
    : never;

/**
 * Utility type that trims multiple slashes from a path string,
 * but preserves `://` separators.
 *
 * @example
 * SafeTrimPath<"https://path//to//resource/">
 * // "https://path/to/resource"
 */
type SafeTrimPath<Path extends string> = Path extends `${infer Before}://${infer After}`
  ? `${TrimPath<Before>}://${SafeTrimPath<After>}`
  : TrimPath<Path>;

/**
 * Utility type that trims multiple slashes from a path string
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
 * Replace [param] in path with actual values.
 * - If Mocking is true, replace missing parameters with colon syntax. (e.g., ":id")
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
 *
 * ReplacePathParams<"/path/[param]", {}, true>
 * // "/path/:param"
 */
type ReplacePathParams<
  Path extends string,
  Params extends SchemaParams,
  Mocking = false,
> = Path extends `${infer Before}[[...${infer Param}]]${infer After}`
  ? Param extends keyof Params
    ? Params[Param] extends SchemaArrayParam
      ? `${ReplacePathParams<Before, Params, Mocking>}${JoinParams<Params[Param]>}${ReplacePathParams<After, Params, Mocking>}`
      : never
    : Mocking extends true
      ? `${ReplacePathParams<Before, Params, Mocking>}:${Param}*${ReplacePathParams<After, Params, Mocking>}`
      : `${ReplacePathParams<Before, Params, Mocking>}${ReplacePathParams<After, Params, Mocking>}`
  : Path extends `${infer Before}[...${infer Param}]${infer After}`
    ? Param extends keyof Params
      ? Params[Param] extends SchemaArrayParam
        ? `${ReplacePathParams<Before, Params, Mocking>}${JoinParams<Params[Param]>}${ReplacePathParams<After, Params, Mocking>}`
        : never
      : Mocking extends true
        ? `${ReplacePathParams<Before, Params, Mocking>}:${Param}+${ReplacePathParams<After, Params, Mocking>}`
        : never
    : Path extends `${infer Before}[${infer Param}]${infer After}`
      ? Param extends keyof Params
        ? Params[Param] extends SchemaPrimitiveParam
          ? `${Before}${Params[Param]}${ReplacePathParams<After, Params, Mocking>}`
          : never
        : Mocking extends true
          ? `${Before}:${Param}${ReplacePathParams<After, Params, Mocking>}`
          : never
      : Path;

/**
 * Applies path parameters if they exist
 * - If Mocking is true, replace missing parameters with `*`.
 *
 * @example
 * ApplyParams<"/users/[userId]", { userId: 123 }>
 * // "/users/123"
 *
 * ApplyParams<"/">
 * // "/"
 *
 * ApplyParams<"/path/[param]", {}, true>
 * // "/path/:param"
 */
type ApplyParams<
  Path extends string,
  Params extends Nullable<Optional<ExtractParams<Path, Mocking>>>,
  Mocking = false,
> = SafeTrimPath<
  keyof Params extends never
    ? ReplacePathParams<Path, EmptyObject, Mocking>
    : Params extends SchemaParams
      ? ReplacePathParams<Path, Params, Mocking>
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
  Params extends Nullable<Optional<ExtractParams<Path, Mocking>>> = undefined,
  Queries extends Nullable<SchemaQueries> = undefined,
  Hash extends Nullable<string> = undefined,
  Mocking = false,
> = ApplyHash<ApplyQueries<ApplyParams<Path, Params, Mocking>, Queries>, Hash>;

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
type ActualReturn<Endpoint extends string, Options, Mocking = false> = ExpectedPath<
  Endpoint,
  Options extends { params: infer Params extends Nullable<Optional<ExtractParams<Endpoint, Mocking>>> }
    ? Params
    : undefined,
  Options extends { queries?: infer Queries extends Nullable<SchemaQueries> } ? Queries : undefined,
  Options extends { hash: infer Hash extends string } ? Hash : undefined,
  Mocking
>;

/**
 * Alias for methods with no parameters
 */
export type Empty = Nullable<Record<string, never>>;

/**
 * Utility type that enforces mutual exclusivity between two types
 *
 * @example
 * type T = Exclusive<{ a: string }, { b: number }>
 * const x: T = { a: "" } // valid
 * const y: T = { b: 0 } // valid
 * const z: T = { a: "", b: 0 } // error
 */
type Exclusive<T, U> = (T & { [K in keyof U]?: never }) | (U & { [K in keyof T]?: never });

/**
 * Utility type that simplifies a type by flattening its structure
 */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Function type that returns a URL string based on the schema definition
 * - Accepts parameters depending on whether required fields exist
 */
type Method<BaseUrl extends string, Endpoint extends string, OptionsSchema> = OptionsSchema extends Empty
  ? () => `${BaseUrl}${Endpoint}`
  : OptionsSchema extends Options
    ? HasRequired<ActualOptions<OptionsSchema, Endpoint>> extends true
      ? <Options extends Simplify<ActualOptions<OptionsSchema, Endpoint>>>(
          options: Simplify<Options>,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
      : <Options extends Simplify<ActualOptions<OptionsSchema, Endpoint>>>(
          options?: Simplify<Options>,
        ) => `${BaseUrl}${ActualReturn<Endpoint, Options>}`
    : never;

/**
 * Function type for mock method, which allows more flexible parameters (e.g., all optional and accepts any value) for testing purposes.
 * - If the schema definition has no parameters, it behaves the same as the normal method.
 * - If the schema definition has parameters, it allows all parameters to be optional and accepts any value, while still returning a correctly typed URL string.
 */
type MockMethod<BaseUrl extends string, Endpoint extends string, OptionsSchema> = OptionsSchema extends Empty
  ? () => `${BaseUrl}${Endpoint}`
  : OptionsSchema extends Options
    ? <Options extends Simplify<ActualOptions<OptionsSchema, Endpoint, true>>>(
        options?: Simplify<Options>,
      ) => `${BaseUrl}${ActualReturn<Endpoint, Options, true>}`
    : never;

/**
 * Expected schema definition:
 * - Endpoint string as key
 * - Object of HTTP methods as values
 * - Each method can have its own schema definition
 */
export type ExpectedSchema<Schema> = {
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? Schema[EndpointKey] extends Record<string, never>
      ? never
      :
          | Exclusive<Partial<Record<HttpMethod, ExpectedOptions<EndpointKey>>>, ExpectedOptions<EndpointKey>>
          | (HasParams<EndpointKey> extends false ? Empty : never)
    : never;
};

/**
 * Utility type that adds a `mock` method to T.
 */
type WithMock<BaseUrl extends string, Endpoint extends string, OptionsSchema, T> = T & {
  mock: MockMethod<BaseUrl, Endpoint, OptionsSchema>;
};

/**
 * Extracts the value types for a specific key 'K' from all members of a union 'U'.
 * This uses distributive conditional types to ensure that if 'K' exists in any
 * member of the union, its type is collected into a resulting union.
 *
 * @example
 * MapValues<{ a: string; b: number } | { b: string; c: boolean }, "b">
 * // number | string
 *
 * MapValues<{ a: string; b: number } | { c: boolean }, "b">
 * // number
 */
type MapValues<U, K> = U extends unknown ? (K extends keyof U ? U[K] : never) : never;

/**
 * Collects all possible keys from all members of a union type 'T'.
 * Unlike 'keyof T' which only returns keys common to all members (intersection of keys),
 * this returns the union of all keys present in any of the members.
 *
 * @example
 * AllKeys<{ a: string; b: number } | { b: string; c: boolean }>
 * // "a" | "b" | "c"
 */
type AllKeys<T> = T extends unknown ? keyof T : never;

/**
 * Recursively merges a union of objects into a single object structure.
 * - If a property is an array, it preserves the array type without merging its internal elements.
 * - If a property is an object, it recursively merges its structure.
 * - Otherwise, it keeps the property as a union of all possible values.
 *
 * @example
 * DeepMerge<{ a: string; b: number; x: { y: string } } | { b: string; c: boolean[]; x: { z: number } }>
 * // { a: string; b: string | number; c: boolean[]; x: { y: string; z: number } }
 */
type DeepMerge<U> = Simplify<{
  [K in AllKeys<U>]: MapValues<U, K> extends unknown[]
    ? MapValues<U, K>
    : MapValues<U, K> extends object
      ? DeepMerge<MapValues<U, K>>
      : MapValues<U, K>;
}>;

/**
 * Actual schema returned from the function:
 * - Each method is replaced with a typed URL generator
 * - Each endpoint and method includes a `mock` method that allows more flexible parameters for testing purposes.
 */
export type ActualSchema<Schema, BaseUrl extends string> = {
  [EndpointKey in keyof Schema]: EndpointKey extends string
    ? Schema[EndpointKey] extends Empty | Options
      ? Simplify<
          WithMock<
            BaseUrl,
            EndpointKey,
            Schema[EndpointKey],
            {
              get: WithMock<
                BaseUrl,
                EndpointKey,
                Schema[EndpointKey],
                Method<BaseUrl, EndpointKey, Schema[EndpointKey]>
              >;
            }
          >
        >
      : Simplify<
          WithMock<
            BaseUrl,
            EndpointKey,
            DeepMerge<Schema[EndpointKey][keyof Schema[EndpointKey]]>,
            {
              [Key in keyof Schema[EndpointKey] as Key extends HttpMethod ? Key : never]: WithMock<
                BaseUrl,
                EndpointKey,
                Schema[EndpointKey][Key],
                Method<BaseUrl, EndpointKey, Schema[EndpointKey][Key]>
              >;
            }
          >
        >
    : never;
};
