import schema from ".";

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

      it("引数の型がないこと", () => {
        expectTypeOf(routes["/methods"].get).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].post).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].put).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/methods"].delete).parameters.toEqualTypeOf<[]>();
        expectTypeOf(routes["/short"].get).parameters.toEqualTypeOf<[]>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods"].get()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].post()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].put()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/methods"].delete()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/short"].get()).toEqualTypeOf<"/short">();
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
        expectTypeOf(routes["/methods/[param]"].get).parameters.branded.toEqualTypeOf<
          [{ params: { param: string } }]
        >();

        expectTypeOf(routes["/short/[param]"].get).parameters.branded.toEqualTypeOf<[{ params: { param: string } }]>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/methods/[param]"].get({ params: { param: "value" } }),
        ).toEqualTypeOf<`/methods/${string}`>();

        expectTypeOf(routes["/short/[param]"].get({ params: { param: "value" } })).toEqualTypeOf<`/short/${string}`>();

        expectTypeOf(
          routes["/methods/[param]"].get({ params: { param: "value" } } as const),
        ).toEqualTypeOf<"/methods/value">();

        expectTypeOf(
          routes["/short/[param]"].get({ params: { param: "value" } } as const),
        ).toEqualTypeOf<"/short/value">();
      });
    });

    describe("Multiple Path Parameters", () => {
      const routes = schema.routes({
        "/methods/[param1]/[param2]": {
          get: {
            params: {
              param1: schema.type as string,
              param2: schema.type as string,
            },
          },
        },
        "/short/[param1]/[param2]": {
          params: {
            param1: schema.type as string,
            param2: schema.type as string,
          },
        },
      });

      it("引数が要求されること", () => {
        expectTypeOf(routes["/methods/[param1]/[param2]"].get).parameters.branded.toEqualTypeOf<
          [{ params: { param1: string; param2: string } }]
        >();

        expectTypeOf(routes["/short/[param1]/[param2]"].get).parameters.branded.toEqualTypeOf<
          [{ params: { param1: string; param2: string } }]
        >();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/methods/[param1]/[param2]"].get({ params: { param1: "value1", param2: "value2" } }),
        ).toEqualTypeOf<`/methods/${string}/${string}`>();

        expectTypeOf(
          routes["/short/[param1]/[param2]"].get({ params: { param1: "value1", param2: "value2" } }),
        ).toEqualTypeOf<`/short/${string}/${string}`>();

        expectTypeOf(
          routes["/methods/[param1]/[param2]"].get({ params: { param1: "value1", param2: "value2" } } as const),
        ).toEqualTypeOf<"/methods/value1/value2">();

        expectTypeOf(
          routes["/short/[param1]/[param2]"].get({ params: { param1: "value1", param2: "value2" } } as const),
        ).toEqualTypeOf<"/short/value1/value2">();
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
        expectTypeOf(routes["/methods/[...params]"].get).parameters.branded.toEqualTypeOf<
          [{ params: { params: readonly string[] } }]
        >();

        expectTypeOf(routes["/short/[...params]"].get).parameters.branded.toEqualTypeOf<
          [{ params: { params: readonly string[] } }]
        >();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/methods/[...params]"].get({ params: { params: ["value1", "value2"] } }),
        ).toEqualTypeOf<`/methods/${string}`>();

        expectTypeOf(
          routes["/short/[...params]"].get({ params: { params: ["value1", "value2"] } }),
        ).toEqualTypeOf<`/short/${string}`>();

        expectTypeOf(
          routes["/methods/[...params]"].get({ params: { params: ["value1", "value2"] } } as const),
        ).toEqualTypeOf<"/methods/value1/value2">();

        expectTypeOf(
          routes["/short/[...params]"].get({ params: { params: ["value1", "value2"] } } as const),
        ).toEqualTypeOf<"/short/value1/value2">();
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
        // expectTypeOf(routes["/methods/[[...params]]"].get).parameters.branded.toEqualTypeOf の形式だと何故かテストが通らない
        expectTypeOf<Parameters<(typeof routes)["/methods/[[...params]]"]["get"]>>().branded.toEqualTypeOf<
          [{ params?: { params?: Readonly<string[]> } }?]
        >();

        expectTypeOf<Parameters<(typeof routes)["/short/[[...params]]"]["get"]>>().branded.toEqualTypeOf<
          [{ params?: { params?: Readonly<string[]> } }?]
        >();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/methods/[[...params]]"].get()).toEqualTypeOf<"/methods">();
        expectTypeOf(routes["/short/[[...params]]"].get()).toEqualTypeOf<"/short">();

        expectTypeOf(
          routes["/methods/[[...params]]"].get({ params: { params: ["value1", "value2"] } }),
        ).toEqualTypeOf<`/methods/${string}`>();

        expectTypeOf(
          routes["/short/[[...params]]"].get({ params: { params: ["value1", "value2"] } }),
        ).toEqualTypeOf<`/short/${string}`>();

        expectTypeOf(
          routes["/methods/[[...params]]"].get({ params: { params: ["value1", "value2"] } } as const),
        ).toEqualTypeOf<"/methods/value1/value2">();

        expectTypeOf(
          routes["/short/[[...params]]"].get({ params: { params: ["value1", "value2"] } } as const),
        ).toEqualTypeOf<"/short/value1/value2">();
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

      it("戻り値が詳細に推論されること", () => {
        const result = routes["/queries/required"].get({
          queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] },
        });
        expectTypeOf(result).toEqualTypeOf<`/queries/required?${string}`>();
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

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/queries/optional"].get()).toEqualTypeOf<`/queries/optional${string}`>();

        const result = routes["/queries/optional"].get({
          queries: { string: "value", number: 1, boolean: true, array: ["a", "b"] },
        });
        expectTypeOf(result).toEqualTypeOf<`/queries/optional?${string}`>();
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

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(
          routes["/queries/both"].get({ queries: { string: "value", number: 1 } }),
        ).toEqualTypeOf<`/queries/both?${string}`>();
      });
    });

    describe("Hash Parameters", () => {
      const routes = schema.routes({
        "/hash": {
          get: {
            hash: schema.type as string,
          },
        },
      });

      it("省略可能な引数が要求されること", () => {
        // expectTypeOf(routes["/hash"].get).parameters.toEqualTypeOf の形式だと何故かテストが通らない;
        expectTypeOf<Parameters<(typeof routes)["/hash"]["get"]>>().toEqualTypeOf<[{ hash?: string }?]>();
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/hash"].get()).toEqualTypeOf<"/hash">();

        expectTypeOf(routes["/hash"].get({ hash: "section" })).toEqualTypeOf<`/hash#section`>();

        const opt = { hash: "section" };
        expectTypeOf(routes["/hash"].get(opt)).toEqualTypeOf<`/hash#${string}`>();
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
    });

    describe("Base URL", () => {
      const routes = schema.routes("https://api.example.com", {
        "/path": schema.empty,
      });

      it("戻り値が詳細に推論されること", () => {
        expectTypeOf(routes["/path"].get()).toEqualTypeOf<`https://api.example.com/path`>();
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
    });
  });
});
