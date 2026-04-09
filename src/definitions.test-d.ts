import { expectTypeOf } from "vitest";
import schema from ".";
import type { SchemaArrayParam, SchemaPrimitiveParam, SchemaQuery } from "./types";

describe("routes", () => {
  /**
   * 定義できるパターンは実装側のテストで担保できる
   * そのためここではエラーパターンをメインに考慮する
   */
  describe("定義時の型チェック", () => {
    describe("Path Parameters", () => {
      it("パスパラメータがない場合、パスパラメータのスキーマは定義できないこと", () => {
        schema.routes({
          "/methods": {
            // @ts-expect-error
            get: { params: {} },
          },
          "/short": {
            // @ts-expect-error
            params: {},
          },
        });
      });

      describe("パスパラメータがある場合", () => {
        it("パスパラメータのスキーマ定義を省略できないこと", () => {
          schema.routes({
            "/methods/[param]": {
              // @ts-expect-error
              get: schema.empty,
            },
            // @ts-expect-error
            "/short/[param]": schema.empty,
          });
        });

        it("複数のパスパラメータがある場合、パスパラメータのスキーマ定義を省略できないこと", () => {
          schema.routes({
            "/methods/[param1]/[param2]": {
              // @ts-expect-error
              get: schema.empty,
            },
            // @ts-expect-error
            "/short/[param1]/[param2]": schema.empty,
          });
        });

        it("複数のパスパラメータがある場合、一部のパスパラメータのスキーマ定義を省略できないこと", () => {
          schema.routes({
            "/methods/[param1]/[param2]": {
              get: {
                // @ts-expect-error
                params: { param1: schema.type as string },
              },
            },
            "/short/[param1]/[param2]": {
              // @ts-expect-error
              params: { param1: schema.type as string },
            },
          });
        });

        it("パスパラメータのスキーマには string | number のみ指定できること", () => {
          schema.routes({
            "/methods/[string]/[number]/[boolean]/[array]/[null]/[object]/[undefined]/[function]/[symbol]": {
              get: {
                params: {
                  string: schema.type as string,
                  number: schema.type as number,
                  // @ts-expect-error
                  boolean: schema.type as boolean,
                  // @ts-expect-error
                  array: schema.type as unknown[],
                  // @ts-expect-error
                  null: schema.type as null,
                  // @ts-expect-error
                  object: schema.type as object,
                  // @ts-expect-error
                  undefined: schema.type as undefined,
                  // @ts-expect-error
                  function: schema.type as () => void,
                  // @ts-expect-error
                  symbol: schema.type as symbol,
                },
              },
            },
            "/short/[string]/[number]/[boolean]/[array]/[null]/[object]/[undefined]/[function]/[symbol]": {
              params: {
                string: schema.type as string,
                number: schema.type as number,
                // @ts-expect-error
                boolean: schema.type as boolean,
                // @ts-expect-error
                array: schema.type as unknown[],
                // @ts-expect-error
                null: schema.type as null,
                // @ts-expect-error
                object: schema.type as object,
                // @ts-expect-error
                undefined: schema.type as undefined,
                // @ts-expect-error
                function: schema.type as () => void,
                // @ts-expect-error
                symbol: schema.type as symbol,
              },
            },
          });
        });
      });
    });

    describe("Catch-all Parameters", () => {
      it("パスパラメータのスキーマ定義を省略できないこと", () => {
        schema.routes({
          "/methods/[...params]": {
            // @ts-expect-error
            get: schema.empty,
          },
          // @ts-expect-error
          "/short/[...params]": schema.empty,
        });
      });

      it("パスパラメータのスキーマには string[] | number[] のみ指定できること", () => {
        schema.routes({
          "/methods/[...string]/[...number]/[...str]/[...num]/[...boolean]/[...array]/[...null]/[...object]/[...undefined]/[...function]/[...symbol]":
            {
              get: {
                params: {
                  string: schema.type as string[],
                  number: schema.type as number[],
                  // @ts-expect-error
                  str: schema.type as string,
                  // @ts-expect-error
                  num: schema.type as number,
                  // @ts-expect-error
                  boolean: schema.type as boolean,
                  // @ts-expect-error
                  array: schema.type as unknown[],
                  // @ts-expect-error
                  null: schema.type as null,
                  // @ts-expect-error
                  object: schema.type as object,
                  // @ts-expect-error
                  undefined: schema.type as undefined,
                  // @ts-expect-error
                  function: schema.type as () => void,
                  // @ts-expect-error
                  symbol: schema.type as symbol,
                },
              },
            },
          "/short/[...string]/[...number]/[...str]/[...num]/[...boolean]/[...array]/[...null]/[...object]/[...undefined]/[...function]/[...symbol]":
            {
              params: {
                string: schema.type as string[],
                number: schema.type as number[],
                // @ts-expect-error
                str: schema.type as string,
                // @ts-expect-error
                num: schema.type as number,
                // @ts-expect-error
                boolean: schema.type as boolean,
                // @ts-expect-error
                array: schema.type as unknown[],
                // @ts-expect-error
                null: schema.type as null,
                // @ts-expect-error
                object: schema.type as object,
                // @ts-expect-error
                undefined: schema.type as undefined,
                // @ts-expect-error
                function: schema.type as () => void,
                // @ts-expect-error
                symbol: schema.type as symbol,
              },
            },
        });
      });
    });

    describe("Optional Catch-all Parameters", () => {
      it("パスパラメータのスキーマ定義を省略できないこと", () => {
        schema.routes({
          "/methods/[[...params]]": {
            // @ts-expect-error
            get: schema.empty,
          },
          // @ts-expect-error
          "/short/[[...params]]": schema.empty,
        });
      });

      it("パスパラメータのスキーマには string[] | number[] のみ指定できること", () => {
        schema.routes({
          "/methods/[[...string]]/[[...number]]/[[...str]]/[[...num]]/[[...boolean]]/[[...array]]/[[...null]]/[[...object]]/[[...undefined]]/[[...function]]/[[...symbol]]":
            {
              get: {
                params: {
                  string: schema.type as string[],
                  number: schema.type as number[],
                  // @ts-expect-error
                  str: schema.type as string,
                  // @ts-expect-error
                  num: schema.type as number,
                  // @ts-expect-error
                  boolean: schema.type as boolean,
                  // @ts-expect-error
                  array: schema.type as unknown[],
                  // @ts-expect-error
                  null: schema.type as null,
                  // @ts-expect-error
                  object: schema.type as object,
                  // @ts-expect-error
                  undefined: schema.type as undefined,
                  // @ts-expect-error
                  function: schema.type as () => void,
                  // @ts-expect-error
                  symbol: schema.type as symbol,
                },
              },
            },
          "/short/[[...string]]/[[...number]]/[[...boolean]]/[[...array]]/[[...null]]/[[...object]]/[[...undefined]]/[[...function]]/[[...symbol]]":
            {
              params: {
                string: schema.type as string[],
                number: schema.type as number[],
                // @ts-expect-error
                boolean: schema.type as boolean[],
                // @ts-expect-error
                array: schema.type as string[][],
                // @ts-expect-error
                null: schema.type as null[],
                // @ts-expect-error
                object: schema.type as object[],
                // @ts-expect-error
                undefined: schema.type as undefined[],
                // @ts-expect-error
                function: schema.type as (() => void)[],
                // @ts-expect-error
                symbol: schema.type as symbol[],
              },
            },
        });
      });
    });

    describe("Query Parameters", () => {
      it("クエリパラメータのスキーマには object を指定できないこと", () => {
        schema.routes({
          "/methods": {
            get: {
              queries: {
                // @ts-expect-error
                o: schema.type as object,
                // @ts-expect-error
                obj: schema.type as object[],
              },
            },
          },
          "/short": {
            queries: {
              // @ts-expect-error
              o: schema.type as object,
              // @ts-expect-error
              obj: schema.type as object[],
            },
          },
        });
      });
    });

    describe("Hash", () => {
      it("ハッシュパラメータのスキーマには string のみ指定できること", () => {
        schema.routes({
          "/methods/string": { hash: schema.type as string },
          "/methods/string-literal": { hash: schema.type as "section1" | "section2" },
          // @ts-expect-error
          "/methods/number": { hash: schema.type as number },
          // @ts-expect-error
          "/methods/boolean": { hash: schema.type as boolean },
          // @ts-expect-error
          "/methods/array": { hash: schema.type as string[] },
          // @ts-expect-error
          "/methods/object": { hash: schema.type as object },
          // @ts-expect-error
          "/methods/null": { hash: schema.type as null },
          // @ts-expect-error
          "/methods/function": { hash: schema.type as () => void },
          // @ts-expect-error
          "/methods/symbol": { hash: schema.type as symbol },
        });
      });
    });

    describe("Shorthand", () => {
      it("メソッド定義と混同できないこと", () => {
        schema.routes({
          "/case1": {
            // @ts-expect-error
            get: schema.empty,
            queries: {
              q: schema.type as string,
            },
          },
          "/case2": {
            hash: schema.type as string,
            // @ts-expect-error
            post: schema.empty,
          },
        });
      });
    });
  });

  describe("利用時の型チェック", () => {
    describe("No Parameters", () => {
      const routes = schema.routes({
        "/methods": {
          get: schema.empty,
          post: schema.empty,
          put: schema.empty,
          delete: schema.empty,
        },
        "/short": schema.empty,
      });

      it("引数が要求されないこと", () => {
        expectTypeOf(routes["/methods"].get).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].post).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].put).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].delete).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/short"].get).parameters.toEqualTypeOf<[]>();
      });

      it("mock 関数も引数が要求されないこと", () => {
        expectTypeOf(routes["/methods"].mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].get.mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].post.mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].put.mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].delete.mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/short"].mock).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/short"].get.mock).parameters.toEqualTypeOf<[]>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods"].get()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].post()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].put()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].delete()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/short"].get()).toEqualTypeOf<"/short">();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods"].mock()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].get.mock()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].post.mock()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].put.mock()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].delete.mock()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/short"].mock()).toEqualTypeOf<"/short">();
        expectTypeOf(routes["/short"].get.mock()).toEqualTypeOf<"/short">();
      });
    });

    describe("Path Parameters", () => {
      const routes = schema.routes({
        "/methods/[param]": {
          get: {
            params: {
              param: schema.type as string,
            },
          },
        },
        "/short/[param]": {
          params: {
            param: schema.type as string,
          },
        },
      });

      it("引数が要求されること", () => {
        type ExpectedType = [{ params: { param: string } }];

        expectTypeOf(routes["/methods/[param]"].get).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/short/[param]"].get).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("mock 関数では引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [{ params?: { param?: SchemaPrimitiveParam } }?];

        // expectTypeOf(routes["/methods/[params]"].mock).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<Parameters<(typeof routes)["/methods/[param]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<Parameters<(typeof routes)["/methods/[param]"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType>();

        expectTypeOf<Parameters<(typeof routes)["/short/[param]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<Parameters<(typeof routes)["/short/[param]"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        const options1 = { params: { param: "value" } };

        expectTypeOf(routes["/methods/[param]"].get(options1)).toEqualTypeOf<`/methods/${string}`>();
        expectTypeOf(routes["/short/[param]"].get(options1)).toEqualTypeOf<`/short/${string}`>();

        const options2 = { params: { param: "value" } } as const;

        expectTypeOf(routes["/methods/[param]"].get(options2)).toEqualTypeOf<"/methods/value">();
        expectTypeOf(routes["/short/[param]"].get(options2)).toEqualTypeOf<"/short/value">();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[param]"].mock()).toEqualTypeOf<"/methods/:param">();
        expectTypeOf(routes["/methods/[param]"].get.mock()).toEqualTypeOf<"/methods/:param">();
        expectTypeOf(routes["/short/[param]"].mock()).toEqualTypeOf<"/short/:param">();
        expectTypeOf(routes["/short/[param]"].get.mock()).toEqualTypeOf<"/short/:param">();

        const options1 = { params: { param: "value" } };

        expectTypeOf(routes["/methods/[param]"].mock(options1)).toEqualTypeOf<`/methods/${string}`>();
        expectTypeOf(routes["/methods/[param]"].get.mock(options1)).toEqualTypeOf<`/methods/${string}`>();
        expectTypeOf(routes["/short/[param]"].mock(options1)).toEqualTypeOf<`/short/${string}`>();
        expectTypeOf(routes["/short/[param]"].get.mock(options1)).toEqualTypeOf<`/short/${string}`>();

        const options2 = { params: { param: 123 } };

        expectTypeOf(routes["/methods/[param]"].mock(options2)).toEqualTypeOf<`/methods/${number}`>();
        expectTypeOf(routes["/methods/[param]"].get.mock(options2)).toEqualTypeOf<`/methods/${number}`>();
        expectTypeOf(routes["/short/[param]"].mock(options2)).toEqualTypeOf<`/short/${number}`>();
        expectTypeOf(routes["/short/[param]"].get.mock(options2)).toEqualTypeOf<`/short/${number}`>();

        const options3 = { params: { param: "value" } } as const;

        expectTypeOf(routes["/methods/[param]"].mock(options3)).toEqualTypeOf<"/methods/value">();
        expectTypeOf(routes["/methods/[param]"].get.mock(options3)).toEqualTypeOf<"/methods/value">();
        expectTypeOf(routes["/short/[param]"].mock(options3)).toEqualTypeOf<"/short/value">();
        expectTypeOf(routes["/short/[param]"].get.mock(options3)).toEqualTypeOf<"/short/value">();

        const options4 = { params: { param: 123 } } as const;

        expectTypeOf(routes["/methods/[param]"].mock(options4)).toEqualTypeOf<"/methods/123">();
        expectTypeOf(routes["/methods/[param]"].get.mock(options4)).toEqualTypeOf<"/methods/123">();
        expectTypeOf(routes["/short/[param]"].mock(options4)).toEqualTypeOf<"/short/123">();
        expectTypeOf(routes["/short/[param]"].get.mock(options4)).toEqualTypeOf<"/short/123">();
      });
    });

    describe("Multiple Path Parameters", () => {
      const routes = schema.routes({
        "/methods/[param1]/[param2]": {
          get: {
            params: {
              param1: schema.type as string,
              param2: schema.type as number,
            },
          },
        },
        "/short/[param1]/[param2]": {
          params: {
            param1: schema.type as string,
            param2: schema.type as number,
          },
        },
      });

      it("引数が要求されること", () => {
        type ExpectedType = [{ params: { param1: string; param2: number } }];
        // expectTypeOf(routes["/methods/[params]"].get).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<
          Parameters<(typeof routes)["/methods/[param1]/[param2]"]["get"]>
        >().branded.toEqualTypeOf<ExpectedType>();

        expectTypeOf<
          Parameters<(typeof routes)["/short/[param1]/[param2]"]["get"]>
        >().branded.toEqualTypeOf<ExpectedType>();
      });

      it("mock 関数では引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [{ params?: { param1?: SchemaPrimitiveParam; param2?: SchemaPrimitiveParam } }?];

        // expectTypeOf(routes["/methods/[params]"].mock).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<Parameters<(typeof routes)["/methods/[param1]/[param2]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/methods/[param1]/[param2]"]["get"]["mock"]>
        >().toEqualTypeOf<ExpectedType>();

        expectTypeOf<Parameters<(typeof routes)["/short/[param1]/[param2]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/short/[param1]/[param2]"]["get"]["mock"]>
        >().toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        const options1 = { params: { param1: "value", param2: 123 } };

        expectTypeOf(
          routes["/methods/[param1]/[param2]"].get(options1),
        ).toEqualTypeOf<`/methods/${string}/${number}`>();
        expectTypeOf(routes["/short/[param1]/[param2]"].get(options1)).toEqualTypeOf<`/short/${string}/${number}`>();

        const options2 = { params: { param1: "value", param2: 123 } } as const;

        expectTypeOf(routes["/methods/[param1]/[param2]"].get(options2)).toEqualTypeOf<"/methods/value/123">();
        expectTypeOf(routes["/short/[param1]/[param2]"].get(options2)).toEqualTypeOf<"/short/value/123">();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[param1]/[param2]"].mock()).toEqualTypeOf<"/methods/:param1/:param2">();
        expectTypeOf(routes["/methods/[param1]/[param2]"].get.mock()).toEqualTypeOf<"/methods/:param1/:param2">();
        expectTypeOf(routes["/short/[param1]/[param2]"].mock()).toEqualTypeOf<"/short/:param1/:param2">();
        expectTypeOf(routes["/short/[param1]/[param2]"].get.mock()).toEqualTypeOf<"/short/:param1/:param2">();

        const options1 = { params: { param1: "value" } };
        const options2 = { params: { param1: "value" } } as const;

        expectTypeOf(routes["/methods/[param1]/[param2]"].mock(options1)).toEqualTypeOf<`/methods/${string}/:param2`>();
        expectTypeOf(
          routes["/methods/[param1]/[param2]"].get.mock(options1),
        ).toEqualTypeOf<`/methods/${string}/:param2`>();

        expectTypeOf(routes["/methods/[param1]/[param2]"].mock(options2)).toEqualTypeOf<"/methods/value/:param2">();
        expectTypeOf(routes["/methods/[param1]/[param2]"].get.mock(options2)).toEqualTypeOf<"/methods/value/:param2">();

        expectTypeOf(routes["/short/[param1]/[param2]"].mock(options1)).toEqualTypeOf<`/short/${string}/:param2`>();
        expectTypeOf(routes["/short/[param1]/[param2]"].get.mock(options1)).toEqualTypeOf<`/short/${string}/:param2`>();

        expectTypeOf(routes["/short/[param1]/[param2]"].mock(options2)).toEqualTypeOf<"/short/value/:param2">();
        expectTypeOf(routes["/short/[param1]/[param2]"].get.mock(options2)).toEqualTypeOf<"/short/value/:param2">();
      });
    });

    describe("Catch-all Parameters", () => {
      const routes = schema.routes({
        "/methods/[...params]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
        },
        "/short/[...params]": {
          params: {
            params: schema.type as string[],
          },
        },
      });

      it("引数が要求されること", () => {
        type ExpectedType = [{ params: { params: Readonly<string[]> } }];

        expectTypeOf(routes["/methods/[...params]"].get).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/short/[...params]"].get).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("mock 関数では引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [{ params?: { params?: SchemaArrayParam } }?];

        // expectTypeOf(routes["/methods/[params]"].mock).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<Parameters<(typeof routes)["/methods/[...params]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/methods/[...params]"]["get"]["mock"]>
        >().toEqualTypeOf<ExpectedType>();

        expectTypeOf<Parameters<(typeof routes)["/short/[...params]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<Parameters<(typeof routes)["/short/[...params]"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        const options1 = { params: { params: ["value1", "value2"] } };

        expectTypeOf(routes["/methods/[...params]"].get(options1)).toEqualTypeOf<`/methods/${string}`>();
        expectTypeOf(routes["/short/[...params]"].get(options1)).toEqualTypeOf<`/short/${string}`>();

        const options2 = { params: { params: ["value1", "value2"] } } as const;

        expectTypeOf(routes["/methods/[...params]"].get(options2)).toEqualTypeOf<"/methods/value1/value2">();
        expectTypeOf(routes["/short/[...params]"].get(options2)).toEqualTypeOf<"/short/value1/value2">();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[...params]"].mock()).toEqualTypeOf<"/methods/:params+">();
        expectTypeOf(routes["/methods/[...params]"].get.mock()).toEqualTypeOf<"/methods/:params+">();
        expectTypeOf(routes["/short/[...params]"].mock()).toEqualTypeOf<"/short/:params+">();
        expectTypeOf(routes["/short/[...params]"].get.mock()).toEqualTypeOf<"/short/:params+">();

        const options1 = { params: { params: ["value", 123] } };

        expectTypeOf(routes["/methods/[...params]"].mock(options1)).toEqualTypeOf<`/methods/${string | number}`>();
        expectTypeOf(routes["/methods/[...params]"].get.mock(options1)).toEqualTypeOf<`/methods/${string | number}`>();
        expectTypeOf(routes["/short/[...params]"].mock(options1)).toEqualTypeOf<`/short/${string | number}`>();
        expectTypeOf(routes["/short/[...params]"].get.mock(options1)).toEqualTypeOf<`/short/${string | number}`>();

        const options2 = { params: { params: ["value", 123] } } as const;

        expectTypeOf(routes["/methods/[...params]"].mock(options2)).toEqualTypeOf<"/methods/value/123">();
        expectTypeOf(routes["/methods/[...params]"].get.mock(options2)).toEqualTypeOf<"/methods/value/123">();
        expectTypeOf(routes["/short/[...params]"].mock(options2)).toEqualTypeOf<"/short/value/123">();
        expectTypeOf(routes["/short/[...params]"].get.mock(options2)).toEqualTypeOf<"/short/value/123">();
      });
    });

    describe("Optional Catch-all Parameters", () => {
      const routes = schema.routes({
        "/methods/[[...params]]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
        },
        "/short/[[...params]]": {
          params: {
            params: schema.type as string[],
          },
        },
      });

      it("省略可能な引数が要求されること", () => {
        type ExpectedType = [{ params?: { params?: Readonly<string[]> } }?];

        // expectTypeOf(routes["/methods/[[...params]]"].get).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<
          Parameters<(typeof routes)["/methods/[[...params]]"]["get"]>
        >().branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/short/[[...params]]"]["get"]>
        >().branded.toEqualTypeOf<ExpectedType>();
      });

      it("mock 関数も引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [{ params?: { params?: SchemaArrayParam } }?];

        // expectTypeOf(routes["/methods/[[...params]]"].mock).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<Parameters<(typeof routes)["/methods/[[...params]]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/methods/[[...params]]"]["get"]["mock"]>
        >().toEqualTypeOf<ExpectedType>();

        expectTypeOf<Parameters<(typeof routes)["/short/[[...params]]"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<
          Parameters<(typeof routes)["/short/[[...params]]"]["get"]["mock"]>
        >().toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[[...params]]"].get()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/short/[[...params]]"].get()).toEqualTypeOf<"/short">();

        const options1 = { params: { params: ["value1", "value2"] } };

        expectTypeOf(routes["/methods/[[...params]]"].get(options1)).toEqualTypeOf<`/methods/${string}`>();
        expectTypeOf(routes["/short/[[...params]]"].get(options1)).toEqualTypeOf<`/short/${string}`>();

        const options2 = { params: { params: ["value1", "value2"] } } as const;

        expectTypeOf(routes["/methods/[[...params]]"].get(options2)).toEqualTypeOf<"/methods/value1/value2">();
        expectTypeOf(routes["/short/[[...params]]"].get(options2)).toEqualTypeOf<"/short/value1/value2">();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[[...params]]"].mock()).toEqualTypeOf<"/methods/:params*">();
        expectTypeOf(routes["/methods/[[...params]]"].get.mock()).toEqualTypeOf<"/methods/:params*">();
        expectTypeOf(routes["/short/[[...params]]"].mock()).toEqualTypeOf<"/short/:params*">();
        expectTypeOf(routes["/short/[[...params]]"].get.mock()).toEqualTypeOf<"/short/:params*">();

        const options1 = { params: { params: ["value", 123] } };

        expectTypeOf(routes["/methods/[[...params]]"].mock(options1)).toEqualTypeOf<`/methods/${string | number}`>();
        expectTypeOf(routes["/short/[[...params]]"].mock(options1)).toEqualTypeOf<`/short/${string | number}`>();
        expectTypeOf(
          routes["/methods/[[...params]]"].get.mock(options1),
        ).toEqualTypeOf<`/methods/${string | number}`>();
        expectTypeOf(routes["/short/[[...params]]"].get.mock(options1)).toEqualTypeOf<`/short/${string | number}`>();

        const options2 = { params: { params: ["value", 123] } } as const;

        expectTypeOf(routes["/methods/[[...params]]"].mock(options2)).toEqualTypeOf<"/methods/value/123">();
        expectTypeOf(routes["/short/[[...params]]"].mock(options2)).toEqualTypeOf<"/short/value/123">();
        expectTypeOf(routes["/methods/[[...params]]"].get.mock(options2)).toEqualTypeOf<"/methods/value/123">();
        expectTypeOf(routes["/short/[[...params]]"].get.mock(options2)).toEqualTypeOf<"/short/value/123">();
      });
    });

    describe("Query Parameters: required", () => {
      const routes = schema.routes({
        "/queries/required": {
          get: {
            queries: {
              string: schema.type as string,
              number: schema.type as number,
              boolean: schema.type as boolean,
              array: schema.type as string[],
            },
          },
        },
      });

      it("引数が要求されること", () => {
        // expectTypeOf(routes["/queries/required"].get).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない;
        expectTypeOf<Parameters<(typeof routes)["/queries/required"]["get"]>>().branded.toEqualTypeOf<
          [
            {
              queries: {
                string: string;
                number: number;
                boolean: Readonly<boolean>;
                array: Readonly<string[]>;
              };
            },
          ]
        >();
      });

      it("mock 関数では引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [
          {
            queries?: {
              string?: SchemaQuery;
              number?: SchemaQuery;
              boolean?: SchemaQuery;
              array?: SchemaQuery;
            };
          }?,
        ];

        expectTypeOf(routes["/queries/required"].mock).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/queries/required"].get.mock).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        const result = routes["/queries/required"].get({
          queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] },
        });
        expectTypeOf(result).toEqualTypeOf<`/queries/required?${string}`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/queries/required${string}`;
        expectTypeOf(routes["/queries/required"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/queries/required"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/queries/required?${string}`;
        const options = { queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] } };
        expectTypeOf(routes["/queries/required"].mock(options)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/queries/required"].get.mock(options)).toEqualTypeOf<ExpectedType2>();
      });
    });

    describe("Query Parameters: optional", () => {
      const routes = schema.routes({
        "/queries/optional": {
          get: {
            queries: {
              string: schema.type as string | undefined,
              number: schema.type as number | undefined,
              boolean: schema.type as boolean | undefined,
              array: schema.type as string[] | undefined,
            },
          },
        },
      });

      it("省略可能な引数が要求されること", () => {
        expectTypeOf(routes["/queries/optional"].get).parameters.branded.toEqualTypeOf<
          [
            {
              queries?: {
                string?: string;
                number?: number;
                boolean?: Readonly<boolean>;
                array?: Readonly<string[]>;
              };
            }?,
          ]
        >();
      });

      it("mock 関数も引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [
          {
            queries?: {
              string?: SchemaQuery;
              number?: SchemaQuery;
              boolean?: SchemaQuery;
              array?: SchemaQuery;
            };
          }?,
        ];
        expectTypeOf(routes["/queries/optional"].mock).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/queries/optional"].get.mock).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/queries/optional"].get()).toEqualTypeOf<`/queries/optional${string}`>();

        const result = routes["/queries/optional"].get({
          queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] },
        });
        expectTypeOf(result).toEqualTypeOf<`/queries/optional?${string}`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/queries/optional${string}`;
        expectTypeOf(routes["/queries/optional"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/queries/optional"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/queries/optional?${string}`;
        const options = { queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] } };
        expectTypeOf(routes["/queries/optional"].mock(options)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/queries/optional"].get.mock(options)).toEqualTypeOf<ExpectedType2>();
      });
    });

    describe("Query Parameters: mix", () => {
      const routes = schema.routes({
        "/queries/both": {
          get: {
            queries: {
              string: schema.type as string,
              number: schema.type as number,
              boolean: schema.type as boolean | undefined,
              array: schema.type as string[] | undefined,
            },
          },
        },
      });

      it("引数が要求されること", () => {
        // expectTypeOf(routes["/queries/both"].get).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない;
        expectTypeOf<Parameters<(typeof routes)["/queries/both"]["get"]>>().branded.toEqualTypeOf<
          [
            {
              queries: {
                string: string;
                number: number;
                boolean?: Readonly<boolean>;
                array?: Readonly<string[]>;
              };
            },
          ]
        >();
      });

      it("mock 関数も引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [
          {
            queries?: {
              string?: SchemaQuery;
              number?: SchemaQuery;
              boolean?: SchemaQuery;
              array?: SchemaQuery;
            };
          }?,
        ];
        expectTypeOf(routes["/queries/both"].mock).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/queries/both"].get.mock).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/queries/both"].get({ queries: { string: "value", number: 1 } }),
        ).toEqualTypeOf<`/queries/both?${string}`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/queries/both${string}`;
        expectTypeOf(routes["/queries/both"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/queries/both"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/queries/both?${string}`;
        const options = { queries: { string: "value", number: 1 } };
        expectTypeOf(routes["/queries/both"].mock(options)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/queries/both"].get.mock(options)).toEqualTypeOf<ExpectedType2>();
      });
    });

    describe("Hash Parameters", () => {
      const routes = schema.routes({
        "/hash": {
          get: {
            hash: schema.type as "hash1" | "hash2",
          },
        },
      });

      it("省略可能な引数が要求されること", () => {
        // expectTypeOf(routes["/hash"].get).parameters.toEqualTypeOf の形式だと何故かテストが通らない;
        expectTypeOf<Parameters<(typeof routes)["/hash"]["get"]>>().toEqualTypeOf<[{ hash?: "hash1" | "hash2" }?]>();
      });

      it("mock 関数も引数が省略でき、パラメータの型が緩いこと", () => {
        // expectTypeOf(routes["/hash"].mock).parameters.toEqualTypeOf の形式だと何故かテストが通らない;
        type ExpectedType = [{ hash?: string }?];
        expectTypeOf<Parameters<(typeof routes)["/hash"]["mock"]>>().toEqualTypeOf<ExpectedType>();
        expectTypeOf<Parameters<(typeof routes)["/hash"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/hash"].get()).toEqualTypeOf<"/hash">();

        expectTypeOf(routes["/hash"].get({ hash: "hash1" })).toEqualTypeOf<`/hash#hash1`>();
        expectTypeOf(routes["/hash"].get({ hash: "hash2" })).toEqualTypeOf<`/hash#hash2`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/hash`;
        expectTypeOf(routes["/hash"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/hash"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/hash#${string}`;
        const options1 = { hash: "hash1" };
        expectTypeOf(routes["/hash"].mock(options1)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/hash"].get.mock(options1)).toEqualTypeOf<ExpectedType2>();

        type ExpectedType3 = `/hash#hash1`;
        const options2 = { hash: "hash1" } as const;
        expectTypeOf(routes["/hash"].mock(options2)).toEqualTypeOf<ExpectedType3>();
        expectTypeOf(routes["/hash"].get.mock(options2)).toEqualTypeOf<ExpectedType3>();
      });
    });

    describe("All Parameters", () => {
      const routes = schema.routes({
        "/all/[param]": {
          get: {
            params: {
              param: schema.type as string,
            },
            queries: {
              optional: schema.type as string | undefined,
            },
            hash: schema.type as string,
          },
        },
      });

      it("引数が要求されること", () => {
        expectTypeOf(routes["/all/[param]"].get).parameters.branded.toEqualTypeOf<
          [
            {
              params: { param: string };
              queries?: { optional?: string };
              hash?: string;
            },
          ]
        >();
      });

      it("mock 関数も引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType = [
          {
            params?: { param?: SchemaPrimitiveParam };
            queries?: { optional?: SchemaQuery };
            hash?: string;
          }?,
        ];
        expectTypeOf(routes["/all/[param]"].mock).parameters.branded.toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/all/[param]"].get.mock).parameters.branded.toEqualTypeOf<ExpectedType>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/all/[param]"].get({ params: { param: "value" }, hash: "section" } as const),
        ).toEqualTypeOf<`/all/value#section`>();

        expectTypeOf(
          routes["/all/[param]"].get({ params: { param: "value" }, queries: { optional: "opt" } } as const),
        ).toEqualTypeOf<`/all/value?${string}`>();

        expectTypeOf(
          routes["/all/[param]"].get({
            params: { param: "value" },
            queries: { optional: "opt" },
            hash: "section",
          } as const),
        ).toEqualTypeOf<`/all/value?${string}#section`>();

        const opt = {
          params: { param: "value" },
          queries: { optional: "opt" },
          hash: "section",
        };
        expectTypeOf(routes["/all/[param]"].get(opt)).toEqualTypeOf<`/all/${string}?${string}#${string}`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/all/:param${string}`;
        expectTypeOf(routes["/all/[param]"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/all/[param]"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/all/${string}?${string}#${string}`;
        const options = {
          params: { param: "value" },
          queries: { optional: "opt" },
          hash: "section",
        };
        expectTypeOf(routes["/all/[param]"].mock(options)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/all/[param]"].get.mock(options)).toEqualTypeOf<ExpectedType2>();

        type ExpectedType3 = `/all/value?${string}#section`;
        const options2 = {
          params: { param: "value" },
          queries: { optional: "opt" },
          hash: "section",
        } as const;
        expectTypeOf(routes["/all/[param]"].mock(options2)).toEqualTypeOf<ExpectedType3>();
        expectTypeOf(routes["/all/[param]"].get.mock(options2)).toEqualTypeOf<ExpectedType3>();
      });
    });

    describe("Base URL", () => {
      const routes = schema.routes("https://api.example.com", {
        "/path": schema.empty,
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/path"].get()).toEqualTypeOf<`https://api.example.com/path`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType = `https://api.example.com/path`;
        expectTypeOf(routes["/path"].mock()).toEqualTypeOf<ExpectedType>();
        expectTypeOf(routes["/path"].get.mock()).toEqualTypeOf<ExpectedType>();
      });
    });

    describe("Custom Schema", () => {
      const routes = schema.routes({
        "myapp://path": schema.empty,
        "myapp://path/[param]": {
          params: {
            param: schema.type as string,
          },
        },
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["myapp://path"].get()).toEqualTypeOf<`myapp://path`>();

        expectTypeOf(
          routes["myapp://path/[param]"].get({ params: { param: "value" } }),
        ).toEqualTypeOf<`myapp://path/${string}`>();

        expectTypeOf(
          routes["myapp://path/[param]"].get({ params: { param: "value" } } as const),
        ).toEqualTypeOf<`myapp://path/value`>();
      });

      it("mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `myapp://path`;
        expectTypeOf(routes["myapp://path"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["myapp://path"].get.mock()).toEqualTypeOf<ExpectedType1>();
      });
    });

    describe("Mock", () => {
      const routes = schema.routes({
        "/[param]": {
          get: {
            params: {
              param: schema.type as string,
            },
            queries: {
              a: schema.type as string,
              x: schema.type as string,
            },
            hash: schema.type as "hash1",
          },
          post: {
            params: {
              param: schema.type as number,
            },
            queries: {
              b: schema.type as number,
              x: schema.type as number,
            },
            hash: schema.type as "hash2",
          },
        },
        "/[...params]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
          put: {
            params: {
              params: schema.type as number[],
            },
          },
        },
        "/[[...params]]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
          delete: {
            params: {
              params: schema.type as number[],
            },
          },
        },
        "/[p1]/[...p2]/[[...p3]]": {
          params: {
            p1: schema.type as string,
            p2: schema.type as string[],
            p3: schema.type as string[],
          },
        },
      });

      it("トップレベルの mock 関数は各 HTTP メソッドを包括した引数を受けること", () => {
        type ExpectedType1 = [
          {
            params?: { param?: SchemaPrimitiveParam };
            queries?: { a?: SchemaQuery; b?: SchemaQuery; x?: SchemaQuery };
            hash?: string;
          }?,
        ];
        expectTypeOf(routes["/[param]"].mock).parameters.toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = [
          {
            params?: { params?: SchemaArrayParam };
          }?,
        ];
        expectTypeOf<Parameters<(typeof routes)["/[...params]"]["mock"]>>().toEqualTypeOf<ExpectedType2>();
        expectTypeOf<Parameters<(typeof routes)["/[[...params]]"]["mock"]>>().toEqualTypeOf<ExpectedType2>();
      });

      it("トップレベルの mock 関数は HTTP メソッドが複数あっても戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/[param]"].mock()).toEqualTypeOf<`/:param${string}`>();
        expectTypeOf(routes["/[...params]"].mock()).toEqualTypeOf<`/:params+`>();
        expectTypeOf(routes["/[[...params]]"].mock()).toEqualTypeOf<`/:params*`>();

        const options1 = { params: { param: "value" }, queries: { a: "a", b: "b" }, hash: "hash" };
        expectTypeOf(routes["/[param]"].mock(options1)).toEqualTypeOf<`/${string}?${string}#${string}`>();

        const options2 = { params: { param: "value" }, queries: { x: "x" }, hash: "hash" } as const;
        expectTypeOf(routes["/[param]"].mock(options2)).toEqualTypeOf<`/value?${string}#hash`>();

        const options3 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/[...params]"].mock(options3)).toEqualTypeOf<`/${string}`>();
        expectTypeOf(routes["/[[...params]]"].mock(options3)).toEqualTypeOf<`/${string}`>();

        const options4 = { params: { params: [123, 456] } } as const;
        expectTypeOf(routes["/[...params]"].mock(options4)).toEqualTypeOf<`/123/456`>();
        expectTypeOf(routes["/[[...params]]"].mock(options4)).toEqualTypeOf<`/123/456`>();
      });

      it("HTTP メソッドごとの mock 関数はそれぞれの定義を引き継いでおり、引数が省略でき、パラメータの型が緩いこと", () => {
        type ExpectedType1 = [
          { params?: { param?: SchemaPrimitiveParam }; queries?: { a?: SchemaQuery; x?: SchemaQuery }; hash?: string }?,
        ];
        expectTypeOf(routes["/[param]"].get.mock).parameters.toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = [
          { params?: { param?: SchemaPrimitiveParam }; queries?: { b?: SchemaQuery; x?: SchemaQuery }; hash?: string }?,
        ];
        expectTypeOf(routes["/[param]"].post.mock).parameters.toEqualTypeOf<ExpectedType2>();

        type ExpectedType3 = [{ params?: { params?: SchemaArrayParam } }?];
        expectTypeOf<Parameters<(typeof routes)["/[...params]"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType3>();
        expectTypeOf<Parameters<(typeof routes)["/[...params]"]["put"]["mock"]>>().toEqualTypeOf<ExpectedType3>();
        expectTypeOf<Parameters<(typeof routes)["/[[...params]]"]["get"]["mock"]>>().toEqualTypeOf<ExpectedType3>();
        expectTypeOf<Parameters<(typeof routes)["/[[...params]]"]["delete"]["mock"]>>().toEqualTypeOf<ExpectedType3>();
      });

      it("HTTP メソッドごとの mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `/:param${string}`;
        expectTypeOf(routes["/[param]"].get.mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/[param]"].post.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `/:params+`;
        expectTypeOf(routes["/[...params]"].get.mock()).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/[...params]"].put.mock()).toEqualTypeOf<ExpectedType2>();

        type ExpectedType3 = `/:params*`;
        expectTypeOf(routes["/[[...params]]"].get.mock()).toEqualTypeOf<ExpectedType3>();
        expectTypeOf(routes["/[[...params]]"].delete.mock()).toEqualTypeOf<ExpectedType3>();

        const options1 = { params: { param: "value" }, queries: { a: "a", x: "x" }, hash: "hash" };
        expectTypeOf(routes["/[param]"].get.mock(options1)).toEqualTypeOf<`/${string}?${string}#${string}`>();

        const options2 = { params: { param: "value" }, queries: { b: "b", x: "x" }, hash: "hash" } as const;
        expectTypeOf(routes["/[param]"].post.mock(options2)).toEqualTypeOf<`/value?${string}#hash`>();

        const options3 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/[...params]"].get.mock(options3)).toEqualTypeOf<`/${string}`>();
        expectTypeOf(routes["/[[...params]]"].get.mock(options3)).toEqualTypeOf<`/${string}`>();

        const options4 = { params: { params: [123, 456] } } as const;
        expectTypeOf(routes["/[...params]"].put.mock(options4)).toEqualTypeOf<`/123/456`>();
        expectTypeOf(routes["/[[...params]]"].delete.mock(options4)).toEqualTypeOf<`/123/456`>();
      });
    });

    describe("Base URL", () => {
      const routes = schema.routes("https://api.example.com", {
        "/path": {
          get: schema.empty,
          post: schema.empty,
        },
        "/path/[param]": {
          get: {
            params: {
              param: schema.type as string,
            },
          },
        },
        "/path/[...params]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
        },
        "/path/[[...params]]": {
          get: {
            params: {
              params: schema.type as string[],
            },
          },
        },
        "/path/all/[param]": {
          get: {
            params: {
              param: schema.type as string,
            },
            queries: {
              q: schema.type as string,
            },
            hash: schema.type as string,
          },
        },
        "/short": schema.empty,
        "/short/[param]": {
          params: {
            param: schema.type as string,
          },
        },
        "/short/[...params]": {
          params: {
            params: schema.type as string[],
          },
        },
        "/short/[[...params]]": {
          params: {
            params: schema.type as string[],
          },
        },
        "/short/all/[param]": {
          params: {
            param: schema.type as string,
          },
          queries: {
            q: schema.type as string,
          },
          hash: schema.type as string,
        },
      });

      it("Base URL を含んで戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `https://api.example.com/path`;
        expectTypeOf(routes["/path"].get()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["/path/[[...params]]"].get()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `https://api.example.com/path/${string}`;
        const options1 = { params: { param: "value" } };
        expectTypeOf(routes["/path/[param]"].get(options1)).toEqualTypeOf<ExpectedType2>();

        const options2 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/path/[...params]"].get(options2)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["/path/[[...params]]"].get(options2)).toEqualTypeOf<ExpectedType2>();

        const options3 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        } as const;
        type ExpectedType3 = `https://api.example.com/path/all/value?${string}#hash`;
        expectTypeOf(routes["/path/all/[param]"].get(options3)).toEqualTypeOf<ExpectedType3>();

        type ExpectedType4 = `https://api.example.com/short`;
        expectTypeOf(routes["/short"].get()).toEqualTypeOf<ExpectedType4>();
        expectTypeOf(routes["/short/[[...params]]"].get()).toEqualTypeOf<ExpectedType4>();

        type ExpectedType5 = `https://api.example.com/short/${string}`;
        const options4 = { params: { param: "value" } };
        expectTypeOf(routes["/short/[param]"].get(options4)).toEqualTypeOf<ExpectedType5>();

        const options5 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/short/[...params]"].get(options5)).toEqualTypeOf<ExpectedType5>();
        expectTypeOf(routes["/short/[[...params]]"].get(options5)).toEqualTypeOf<ExpectedType5>();

        const options6 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        } as const;
        type ExpectedType6 = `https://api.example.com/short/all/value?${string}#hash`;
        expectTypeOf(routes["/short/all/[param]"].get(options6)).toEqualTypeOf<ExpectedType6>();
      });

      it("Base URL を含んで mock 関数も戻り値が詳細に推論されること", () => {
        type Base<T extends string> = `https://api.example.com${T}`;
        expectTypeOf(routes["/path"].mock()).toEqualTypeOf<Base<`/path`>>();
        expectTypeOf(routes["/path"].get.mock()).toEqualTypeOf<Base<`/path`>>();

        expectTypeOf(routes["/path/[param]"].mock()).toEqualTypeOf<Base<`/path/:param`>>();
        expectTypeOf(routes["/path/[param]"].get.mock()).toEqualTypeOf<Base<`/path/:param`>>();
        expectTypeOf(routes["/path/[...params]"].mock()).toEqualTypeOf<Base<`/path/:params+`>>();
        expectTypeOf(routes["/path/[...params]"].get.mock()).toEqualTypeOf<Base<`/path/:params+`>>();
        expectTypeOf(routes["/path/[[...params]]"].mock()).toEqualTypeOf<Base<`/path/:params*`>>();
        expectTypeOf(routes["/path/[[...params]]"].get.mock()).toEqualTypeOf<Base<`/path/:params*`>>();

        const options1 = { params: { param: "value" } };
        expectTypeOf(routes["/path/[param]"].mock(options1)).toEqualTypeOf<Base<`/path/${string}`>>();
        expectTypeOf(routes["/path/[param]"].get.mock(options1)).toEqualTypeOf<Base<`/path/${string}`>>();

        const options2 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/path/[...params]"].mock(options2)).toEqualTypeOf<Base<`/path/${string}`>>();
        expectTypeOf(routes["/path/[...params]"].get.mock(options2)).toEqualTypeOf<Base<`/path/${string}`>>();
        expectTypeOf(routes["/path/[[...params]]"].mock(options2)).toEqualTypeOf<Base<`/path/${string}`>>();
        expectTypeOf(routes["/path/[[...params]]"].get.mock(options2)).toEqualTypeOf<Base<`/path/${string}`>>();

        const options3 = { params: { param: "value" } } as const;
        expectTypeOf(routes["/path/[param]"].mock(options3)).toEqualTypeOf<Base<`/path/value`>>();
        expectTypeOf(routes["/path/[param]"].get.mock(options3)).toEqualTypeOf<Base<`/path/value`>>();

        const options4 = { params: { params: ["value1", "value2"] } } as const;
        expectTypeOf(routes["/path/[...params]"].mock(options4)).toEqualTypeOf<Base<`/path/value1/value2`>>();
        expectTypeOf(routes["/path/[...params]"].get.mock(options4)).toEqualTypeOf<Base<`/path/value1/value2`>>();
        expectTypeOf(routes["/path/[[...params]]"].mock(options4)).toEqualTypeOf<Base<`/path/value1/value2`>>();
        expectTypeOf(routes["/path/[[...params]]"].get.mock(options4)).toEqualTypeOf<Base<`/path/value1/value2`>>();

        const options5 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        };
        expectTypeOf(routes["/path/all/[param]"].mock(options5)).toEqualTypeOf<
          Base<`/path/all/${string}?${string}#${string}`>
        >();
        expectTypeOf(routes["/path/all/[param]"].get.mock(options5)).toEqualTypeOf<
          Base<`/path/all/${string}?${string}#${string}`>
        >();

        const options6 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        } as const;
        expectTypeOf(routes["/path/all/[param]"].mock(options6)).toEqualTypeOf<
          Base<`/path/all/value?${string}#hash`>
        >();
        expectTypeOf(routes["/path/all/[param]"].get.mock(options6)).toEqualTypeOf<
          Base<`/path/all/value?${string}#hash`>
        >();

        expectTypeOf(routes["/short"].mock()).toEqualTypeOf<Base<`/short`>>();
        expectTypeOf(routes["/short"].get.mock()).toEqualTypeOf<Base<`/short`>>();

        expectTypeOf(routes["/short/[param]"].mock()).toEqualTypeOf<Base<`/short/:param`>>();
        expectTypeOf(routes["/short/[param]"].get.mock()).toEqualTypeOf<Base<`/short/:param`>>();
        expectTypeOf(routes["/short/[...params]"].mock()).toEqualTypeOf<Base<`/short/:params+`>>();
        expectTypeOf(routes["/short/[...params]"].get.mock()).toEqualTypeOf<Base<`/short/:params+`>>();
        expectTypeOf(routes["/short/[[...params]]"].mock()).toEqualTypeOf<Base<`/short/:params*`>>();
        expectTypeOf(routes["/short/[[...params]]"].get.mock()).toEqualTypeOf<Base<`/short/:params*`>>();

        const options7 = { params: { param: "value" } };
        expectTypeOf(routes["/short/[param]"].mock(options7)).toEqualTypeOf<Base<`/short/${string}`>>();
        expectTypeOf(routes["/short/[param]"].get.mock(options7)).toEqualTypeOf<Base<`/short/${string}`>>();

        const options8 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["/short/[...params]"].mock(options8)).toEqualTypeOf<Base<`/short/${string}`>>();
        expectTypeOf(routes["/short/[...params]"].get.mock(options8)).toEqualTypeOf<Base<`/short/${string}`>>();
        expectTypeOf(routes["/short/[[...params]]"].mock(options8)).toEqualTypeOf<Base<`/short/${string}`>>();
        expectTypeOf(routes["/short/[[...params]]"].get.mock(options8)).toEqualTypeOf<Base<`/short/${string}`>>();

        const options9 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        };
        expectTypeOf(routes["/short/all/[param]"].mock(options9)).toEqualTypeOf<
          Base<`/short/all/${string}?${string}#${string}`>
        >();
        expectTypeOf(routes["/short/all/[param]"].get.mock(options9)).toEqualTypeOf<
          Base<`/short/all/${string}?${string}#${string}`>
        >();

        const options10 = {
          params: { param: "value" },
          queries: { q: "query" },
          hash: "hash",
        } as const;
        expectTypeOf(routes["/short/all/[param]"].mock(options10)).toEqualTypeOf<
          Base<`/short/all/value?${string}#hash`>
        >();
        expectTypeOf(routes["/short/all/[param]"].get.mock(options10)).toEqualTypeOf<
          Base<`/short/all/value?${string}#hash`>
        >();
      });
    });

    describe("Custom Schema", () => {
      const routes = schema.routes({
        "myapp://path": schema.empty,
        "myapp://path/[param]": {
          params: {
            param: schema.type as string,
          },
        },
        "myapp://path/[...params]": {
          params: {
            params: schema.type as string[],
          },
        },
        "myapp://path/[[...params]]": {
          params: {
            params: schema.type as string[],
          },
        },
        "myapp://https://example.com/[param]": {
          params: {
            param: schema.type as string,
          },
        },
        "myapp://path/[[...params]]/https://example.com/[param]": {
          params: {
            params: schema.type as string[],
            param: schema.type as string,
          },
        },
      });

      it("Custom Schema を含んで戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `myapp://path`;
        expectTypeOf(routes["myapp://path"].get()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `myapp://path/${string}`;
        const options1 = { params: { param: "value" } };
        expectTypeOf(routes["myapp://path/[param]"].get(options1)).toEqualTypeOf<ExpectedType2>();

        const options2 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["myapp://path/[...params]"].get(options2)).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["myapp://path/[[...params]]"].get(options2)).toEqualTypeOf<ExpectedType2>();

        const options3 = { params: { param: "value" } } as const;
        type ExpectedType3 = `myapp://path/value`;
        expectTypeOf(routes["myapp://path/[param]"].get(options3)).toEqualTypeOf<ExpectedType3>();

        const options4 = { params: { params: ["value1", "value2"] } } as const;
        type ExpectedType4 = `myapp://path/value1/value2`;
        expectTypeOf(routes["myapp://path/[...params]"].get(options4)).toEqualTypeOf<ExpectedType4>();
        expectTypeOf(routes["myapp://path/[[...params]]"].get(options4)).toEqualTypeOf<ExpectedType4>();
      });

      it("Custom Schema を含んで mock 関数も戻り値が詳細に推論されること", () => {
        type ExpectedType1 = `myapp://path`;
        expectTypeOf(routes["myapp://path"].mock()).toEqualTypeOf<ExpectedType1>();
        expectTypeOf(routes["myapp://path"].get.mock()).toEqualTypeOf<ExpectedType1>();

        type ExpectedType2 = `myapp://path/:param`;
        expectTypeOf(routes["myapp://path/[param]"].mock()).toEqualTypeOf<ExpectedType2>();
        expectTypeOf(routes["myapp://path/[param]"].get.mock()).toEqualTypeOf<ExpectedType2>();

        type ExpectedType3 = `myapp://path/:params+`;
        expectTypeOf(routes["myapp://path/[...params]"].mock()).toEqualTypeOf<ExpectedType3>();
        expectTypeOf(routes["myapp://path/[...params]"].get.mock()).toEqualTypeOf<ExpectedType3>();

        type ExpectedType4 = `myapp://path/:params*`;
        expectTypeOf(routes["myapp://path/[[...params]]"].mock()).toEqualTypeOf<ExpectedType4>();
        expectTypeOf(routes["myapp://path/[[...params]]"].get.mock()).toEqualTypeOf<ExpectedType4>();

        const options1 = { params: { param: "value" } };
        type ExpectedType5 = `myapp://path/${string}`;
        expectTypeOf(routes["myapp://path/[param]"].mock(options1)).toEqualTypeOf<ExpectedType5>();
        expectTypeOf(routes["myapp://path/[param]"].get.mock(options1)).toEqualTypeOf<ExpectedType5>();

        const options2 = { params: { params: ["value1", "value2"] } };
        expectTypeOf(routes["myapp://path/[...params]"].mock(options2)).toEqualTypeOf<ExpectedType5>();
        expectTypeOf(routes["myapp://path/[...params]"].get.mock(options2)).toEqualTypeOf<ExpectedType5>();
        expectTypeOf(routes["myapp://path/[[...params]]"].mock(options2)).toEqualTypeOf<ExpectedType5>();
        expectTypeOf(routes["myapp://path/[[...params]]"].get.mock(options2)).toEqualTypeOf<ExpectedType5>();

        const options3 = { params: { param: "value" } } as const;
        type ExpectedType6 = `myapp://path/value`;
        expectTypeOf(routes["myapp://path/[param]"].mock(options3)).toEqualTypeOf<ExpectedType6>();
        expectTypeOf(routes["myapp://path/[param]"].get.mock(options3)).toEqualTypeOf<ExpectedType6>();

        const options4 = { params: { params: ["value1", "value2"] } } as const;
        type ExpectedType7 = `myapp://path/value1/value2`;
        expectTypeOf(routes["myapp://path/[...params]"].mock(options4)).toEqualTypeOf<ExpectedType7>();
        expectTypeOf(routes["myapp://path/[[...params]]"].mock(options4)).toEqualTypeOf<ExpectedType7>();
      });

      it("2重スキーマが含まれる場合も戻り値が推論されること", () => {
        const options1 = { params: { param: "1" } } as const;
        type ExpectedType1 = `myapp://https://example.com/1`;
        expectTypeOf(routes["myapp://https://example.com/[param]"].get(options1)).toEqualTypeOf<ExpectedType1>();

        const options2 = { params: { params: ["1", "2"], param: "3" } } as const;
        type ExpectedType2 = `myapp://path/1/2/https://example.com/3`;
        expectTypeOf(
          routes["myapp://path/[[...params]]/https://example.com/[param]"].get(options2),
        ).toEqualTypeOf<ExpectedType2>();
      });
    });
  });
});
