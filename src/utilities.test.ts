import { replacePathParams } from "./utilities";

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
