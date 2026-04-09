import { isOptions, replacePathParams, stringifyHash, stringifyQueries } from "./utilities";

describe("replacePathParams", () => {
  it("パスパラメータがない場合は元のパスを返すこと", () => {
    const path = "/no-params";
    const params = {};
    const expectedPath = "/no-params";

    const result = replacePathParams(path, params);

    expect(result).toBe(expectedPath);
  });

  describe("パスパラメータがある場合", () => {
    it("パスパラメータを置換できること", () => {
      const path = "/path/[param1]/[param2]";
      const params = { param1: "1", param2: "2" };
      const expectedPath = "/path/1/2";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パラメータがエンコードされること", () => {
      const path = "/path/[param]";
      const params = { param: "1 2" };
      const expectedPath = "/path/1%202";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パスパラメータが不足している場合はエラーになること", () => {
      const path = "/path/[param1]/[param2]";
      const params = { param1: "1" };

      expect(() => replacePathParams(path, params)).toThrowError('"param2" is required');
    });

    it("パスパラメータが配列の場合はエラーになること", () => {
      const path = "/path/[param]";
      const params = { param: ["1", "2"] };

      expect(() => replacePathParams(path, params)).toThrowError('"param" must not be an array');
    });

    it("モックモードの場合はパスパラメータが不足していてもエラーにならずコロン形式に置換されること", () => {
      const path = "/path/[param]";
      const expectedPath = "/path/:param";

      const result = replacePathParams(path, undefined, true);

      expect(result).toBe(expectedPath);
    });

    it("モックモードの場合はパスパラメータがエンコードされないこと", () => {
      const path = "/path/[param]";
      const params = { param: "あいうえお" };
      const expectedPath = "/path/あいうえお";

      const result = replacePathParams(path, params, true);

      expect(result).toBe(expectedPath);
    });
  });

  describe("可変長なパスパラメータがある場合", () => {
    it("パスパラメータを置換できること", () => {
      const path = "/path/[...params]";
      const params = { params: ["1", "2"] };
      const expectedPath = "/path/1/2";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パラメータがエンコードされること", () => {
      const path = "/path/[...params]";
      const params = { params: ["1 2", "3"] };
      const expectedPath = "/path/1%202/3";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パスパラメータが配列でない場合はエラーになること", () => {
      const path = "/path/[...params]";
      const params = { params: "1" };

      expect(() => replacePathParams(path, params)).toThrowError('"params" must be an array');
    });

    it("パスパラメータが不足している場合はエラーになること", () => {
      const path = "/path/[...params]";
      const params = {};

      expect(() => replacePathParams(path, params)).toThrowError('"params" is required');
    });

    it("モックモードの場合はパスパラメータが不足していてもエラーにならずコロン形式に置換されること", () => {
      const path = "/path/[...params]";
      const expectedPath = "/path/:params+";

      const result = replacePathParams(path, undefined, true);

      expect(result).toBe(expectedPath);
    });

    it("モックモードの場合はパスパラメータがエンコードされないこと", () => {
      const path = "/path/[...params]";
      const params = { params: ["あいう", "かきく"] };
      const expectedPath = "/path/あいう/かきく";

      const result = replacePathParams(path, params, true);

      expect(result).toBe(expectedPath);
    });
  });

  describe("可変長でオプショナルなパスパラメータがある場合", () => {
    it("パスパラメータを置換できること", () => {
      const path = "/path/[[...params]]";
      const params = { params: ["1", "2"] };
      const expectedPath = "/path/1/2";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パラメータがエンコードされること", () => {
      const path = "/path/[[...params]]";
      const params = { params: ["1 2", "3"] };
      const expectedPath = "/path/1%202/3";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パスパラメータが配列でない場合はエラーになること", () => {
      const path = "/path/[[...params]]";
      const params = { params: "1" };

      expect(() => replacePathParams(path, params)).toThrowError('"params" must be an array');
    });

    it("パスパラメータがない場合は元のパスを返すこと", () => {
      const path = "/path/[[...params]]";
      const params = {};
      const expectedPath = "/path";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("モックモードの場合にパスパラメータがなければコロン形式に置換されること", () => {
      const path = "/path/[[...params]]";
      const expectedPath = "/path/:params*";

      const result = replacePathParams(path, undefined, true);

      expect(result).toBe(expectedPath);
    });

    it("モックモードの場合はパスパラメータはエンコードされないこと", () => {
      const path = "/path/[[...params]]";
      const params = { params: ["あいう", "かきく"] };
      const expectedPath = "/path/あいう/かきく";

      const result = replacePathParams(path, params, true);

      expect(result).toBe(expectedPath);
    });
  });

  describe("複数のパスパラメータがある場合", () => {
    it("パスパラメータを置換できること", () => {
      const path = "/path/[param]/[...params1]/[[...params2]]";
      const params = { param: "param", params1: ["pa", "ra"], params2: ["m", "s"] };
      const expectedPath = "/path/param/pa/ra/m/s";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パスパラメータが不足している場合はエラーになること", () => {
      const path = "/path/[param]/[[...params]]";
      const params = { params: ["2", "3"] };

      expect(() => replacePathParams(path, params)).toThrowError('"param" is required');
    });

    it("モックモードの場合はパスパラメータが不足していてもエラーにならずコロン形式に置換されること", () => {
      const path = "/path/[param]/[...params1]/[[...params2]]";
      const expectedPath = "/path/:param/:params1+/:params2*";

      const result = replacePathParams(path, undefined, true);

      expect(result).toBe(expectedPath);
    });

    it("モックモードの場合はパスパラメータがエンコードされないこと", () => {
      const path = "/path/[param]/[...params1]/[[...params2]]";
      const params = {
        param: "あいう",
        params1: ["かきく", "さしす"],
        params2: ["たちつ", "なにぬ"],
      };
      const expectedPath = "/path/あいう/かきく/さしす/たちつ/なにぬ";

      const result = replacePathParams(path, params, true);

      expect(result).toBe(expectedPath);
    });
  });

  describe("パスの先頭の / の扱い", () => {
    it("パスが / で始まる場合、結果のパスも / で始まること", () => {
      const path = "/path/[param]";
      const params = { param: "1" };
      const expectedPath = "/path/1";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });

    it("パスが / で始まらない場合、結果のパスは / で始まらないこと", () => {
      const path = "path/[param]";
      const params = { param: "1" };
      const expectedPath = "path/1";

      const result = replacePathParams(path, params);

      expect(result).toBe(expectedPath);
    });
  });
});

describe("stringifyQueries", () => {
  it.each([undefined, {}])("クエリパラメータがない場合は空文字を返すこと", (queries) => {
    const expectedQueryString = "";

    const result = stringifyQueries(queries);

    expect(result).toBe(expectedQueryString);
  });

  describe("クエリパラメータが設定されている場合", () => {
    it.each([
      [{ string: "string" }, "?string=string"],
      [{ number: 1 }, "?number=1"],
      [{ boolean: true }, "?boolean=true"],
      [{ null: null }, "?null=null"],
      [{ undefined: undefined }, "?undefined=undefined"],
      [{ bigint: BigInt(123) }, "?bigint=123"],
      [{ empty: "" }, "?empty="],
    ])("文字列化されたクエリが返ること", (queries, expected) => {
      const result = stringifyQueries(queries);

      expect(result).toBe(expected);
    });

    it("クエリパラメータがキー名でソートされること", () => {
      const queries = { z: "last", a: "first", n: "middle" };
      const expectedQueryString = "?a=first&n=middle&z=last";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
    });

    it("クエリパラメータがエンコードされること", () => {
      const queries = { encode: "りんご" };
      const expectedQueryString = "?encode=%E3%82%8A%E3%82%93%E3%81%94";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
    });

    it("クエリパラメータの値が配列の場合、キーを繰り返して返すこと", () => {
      const queries = { array: ["1", "2", "3"] };
      const expectedQueryString = "?array=1&array=2&array=3";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
    });

    it("モックモードの場合はクエリパラメータがキー名でソートされてエンコードされないこと", () => {
      const queries = {
        encode: "りんご",
        z: "last",
        array: [2, 1, 3],
      };
      const expectedQueryString = "?array=2&array=1&array=3&encode=りんご&z=last";

      const result = stringifyQueries(queries, true);

      expect(result).toBe(expectedQueryString);
    });
  });
});

describe("stringifyHash", () => {
  it.each([undefined, ""])("ハッシュパラメータがない場合空文字を返すこと", (hash) => {
    const expectedHash = "";

    const result = stringifyHash(hash);

    expect(result).toBe(expectedHash);
  });

  describe("ハッシュパラメータが設定されている場合", () => {
    it("ハッシュが帰ること", () => {
      const hash = "section";
      const expectedHash = "#section";

      const result = stringifyHash(hash);

      expect(result).toBe(expectedHash);
    });

    it("エンコードされること", () => {
      const hash = "りんご";
      const expectedHash = "#%E3%82%8A%E3%82%93%E3%81%94";

      const result = stringifyHash(hash);

      expect(result).toBe(expectedHash);
    });

    it("モックモードの場合はエンコードされないこと", () => {
      const hash = "りんご";
      const expectedHash = "#りんご";

      const result = stringifyHash(hash, true);

      expect(result).toBe(expectedHash);
    });
  });
});

describe("isOptions", () => {
  it("Options に含まれるキーの場合 true を返すこと", () => {
    expect(isOptions("params")).toBe(true);
    expect(isOptions("queries")).toBe(true);
    expect(isOptions("hash")).toBe(true);
  });

  it("Options に含まれないキーの場合 false を返すこと", () => {
    expect(isOptions("get")).toBe(false);
    expect(isOptions("post")).toBe(false);
    expect(isOptions("put")).toBe(false);
    expect(isOptions("delete")).toBe(false);
  });
});
