import { isOptions, replacePathParams, stringifyQueries } from "./utilities";

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

      expect(() => replacePathParams(path, params)).toThrowError('"param" must be not an array');
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
  });

  describe("可変調でオプショナルなパスパラメータがある場合", () => {
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
  });
});

describe("stringifyQueries", () => {
  it("クエリパラメータがない場合は空文字を返すこと", () => {
    const queries = {};
    const expectedQueryString = "";

    const result = stringifyQueries(queries);

    expect(result).toBe(expectedQueryString);
  });

  describe("クエリパラメータが設定されている場合", () => {
    it.each([
      [{ string: "string" }, "string=string"],
      [{ number: 1 }, "number=1"],
      [{ boolean: true }, "boolean=true"],
      [{ null: null }, "null=null"],
      [{ undefined: undefined }, "undefined=undefined"],
      [{ bigint: BigInt(123) }, "bigint=123"],
      [{ empty: "" }, "empty="],
    ])("クエリストリングが返ること", (queries, expected) => {
      const result = stringifyQueries(queries);

      expect(result).toBe(expected);
    });

    it("クエリパラメータがキー名でソートされること", () => {
      const queries = { z: "last", a: "first", n: "middle" };
      const expectedQueryString = "a=first&n=middle&z=last";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
    });

    it("クエリパラメータがエンコードされること", () => {
      const queries = { encode: "りんご" };
      const expectedQueryString = "encode=%E3%82%8A%E3%82%93%E3%81%94";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
    });

    it("クエリパラメータの値が配列の場合、キーを繰り返して返すこと", () => {
      const queries = { array: ["1", "2", "3"] };
      const expectedQueryString = "array=1&array=2&array=3";

      const result = stringifyQueries(queries);

      expect(result).toBe(expectedQueryString);
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
