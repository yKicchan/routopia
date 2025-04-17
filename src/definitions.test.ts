import queryString from "query-string";
import schema from ".";

describe("routes", () => {
  const routes = schema.routes({
    "/methods": {
      get: schema.empty,
      post: schema.empty,
      put: schema.empty,
      delete: schema.empty,
    },
    "/params/[param]": {
      get: {
        params: {
          param: schema.type as string,
        },
      },
    },
    "/params/[param1]/[param2]": {
      get: {
        params: {
          param1: schema.type as string,
          param2: schema.type as string,
        },
      },
    },
    "/params/[...params]": {
      get: {
        params: {
          params: schema.type as string[],
        },
      },
    },
    "/params/[[...params]]": {
      get: {
        params: {
          params: schema.type as string[] | undefined,
        },
      },
    },
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
    "/hash": {
      get: {
        hash: schema.type as string,
      },
    },
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

  it("各エンドポイントに対応するオブジェクトが生成されること", () => {
    expect(routes).toHaveProperty("/methods");
    expect(routes).toHaveProperty(["/params/[param]"]);
    expect(routes).toHaveProperty(["/params/[param1]/[param2]"]);
    expect(routes).toHaveProperty("/queries/required");
    expect(routes).toHaveProperty("/queries/both");
    expect(routes).toHaveProperty("/queries/optional");
    expect(routes).toHaveProperty(["/all/[param]"]);
  });

  it("各エンドポイントに対応するすべての HTTP メソッドが生成されること", () => {
    expect(routes["/methods"].get).toBeInstanceOf(Function);
    expect(routes["/methods"].post).toBeInstanceOf(Function);
    expect(routes["/methods"].put).toBeInstanceOf(Function);
    expect(routes["/methods"].delete).toBeInstanceOf(Function);

    expect(routes["/params/[param]"].get).toBeInstanceOf(Function);
    expect(routes["/params/[param1]/[param2]"].get).toBeInstanceOf(Function);
    expect(routes["/queries/required"].get).toBeInstanceOf(Function);
    expect(routes["/queries/both"].get).toBeInstanceOf(Function);
    expect(routes["/queries/optional"].get).toBeInstanceOf(Function);
    expect(routes["/all/[param]"].get).toBeInstanceOf(Function);
  });

  describe("HTTP メソッドに必要なパラメータがない(empty で宣言されている)場合", () => {
    it("引数なしで URL を生成できること", () => {
      const expectedUrl = "/methods";

      const url = routes["/methods"].get();

      expect(url).toBe(expectedUrl);
    });
  });

  describe("クエリパラメータが宣言されている場合", () => {
    it("クエリパラメータ付きの URL を生成できること", () => {
      const expectedPath = "/queries/required";
      const expectedQueries = {
        string: "string",
        number: 1,
        boolean: true,
        array: ["string"],
      };
      const expectedUrl = `${expectedPath}?${queryString.stringify(expectedQueries)}`;

      const url = routes["/queries/required"].get({
        queries: expectedQueries,
      });

      expect(url).toBe(expectedUrl);
    });

    it("オプショナルなクエリパラメータは省略して URL を生成できること", () => {
      const expectedPath = "/queries/both";
      const expectedQueries = {
        string: "string",
        number: 1,
      };
      const expectedUrl = `${expectedPath}?${queryString.stringify(expectedQueries)}`;

      const url = routes["/queries/both"].get({
        queries: expectedQueries,
      });

      expect(url).toBe(expectedUrl);
    });

    it("パラメータが全て省略可能な場合は、引数なしで URL を生成できること", () => {
      const expectedUrl = "/queries/optional";

      const url = routes["/queries/optional"].get();

      expect(url).toBe(expectedUrl);
    });

    it("エンコードされること", () => {
      const expectedPath = "/queries/optional";
      const expectedQueries = {
        string: "string with space",
      };
      const expectedUrl = `${expectedPath}?string=string%20with%20space`;

      const url = routes["/queries/optional"].get({
        queries: expectedQueries,
      });

      expect(url).toBe(expectedUrl);
    });
  });

  describe("パスパラメータが宣言されている場合", () => {
    it("パスパラメータを指定して URL を生成できること", () => {
      const expectedParams = { param: "1" };
      const expectedUrl = `/params/${expectedParams.param}`;

      const url = routes["/params/[param]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("複数のパスパラメータを指定して URL を生成できること", () => {
      const expectedParams = { param1: "1", param2: "2" };
      const expectedUrl = `/params/${expectedParams.param1}/${expectedParams.param2}`;

      const url = routes["/params/[param1]/[param2]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("可変長なパスパラメータを指定して URL を生成できること", () => {
      const expectedParams = { params: ["1", "2"] };
      const expectedUrl = `/params/${expectedParams.params.join("/")}`;

      const url = routes["/params/[...params]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパスパラメータを指定して URL を生成できること", () => {
      const expectedParams = { params: ["1", "2"] };
      const expectedUrl = `/params/${expectedParams.params.join("/")}`;

      const url = routes["/params/[[...params]]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("可変長なパスパラメータを省略して URL を生成できること", () => {
      const expectedUrl = "/params";

      const url = routes["/params/[[...params]]"].get();

      expect(url).toBe(expectedUrl);
    });
  });

  describe("ハッシュが宣言されている場合", () => {
    it("ハッシュを指定して URL を生成できること", () => {
      const expectedPath = "/hash";
      const expectedHash = "hash";
      const expectedUrl = `${expectedPath}#${expectedHash}`;

      const url = routes["/hash"].get({
        hash: expectedHash,
      });

      expect(url).toBe(expectedUrl);
    });

    it("エンコードされること", () => {
      const expectedPath = "/hash";
      const expectedHash = "hash with space";
      const expectedUrl = `${expectedPath}#hash%20with%20space`;

      const url = routes["/hash"].get({
        hash: expectedHash,
      });

      expect(url).toBe(expectedUrl);
    });

    it("ハッシュパラメータを指定せずに URL を生成できること", () => {
      const expectedUrl = "/hash";

      const url = routes["/hash"].get();

      expect(url).toBe(expectedUrl);
    });
  });

  describe("すべてのパラメータが宣言されている場合", () => {
    it("パスパラメータとクエリパラメータとハッシュを指定して URL を生成できること", () => {
      const expectedParams = { param: "1" };
      const expectedPath = `/all/${expectedParams.param}`;
      const expectedQueries = { optional: "optional" };
      const expectedHash = "hash";
      const expectedUrl = `${expectedPath}?${queryString.stringify(expectedQueries)}#${expectedHash}`;

      const url = routes["/all/[param]"].get({
        params: expectedParams,
        queries: expectedQueries,
        hash: expectedHash,
      });

      expect(url).toBe(expectedUrl);
    });

    it("オプショナルなパラメータは指定なしで URL を生成できること", () => {
      const expectedParams = { param: "1" };
      const expectedUrl = `/all/${expectedParams.param}`;

      const url = routes["/all/[param]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });
  });

  it("baseUrl がついた URL を生成できること", () => {
    const baseUrl = "https://example.com/api";
    const routes = schema.routes(baseUrl, {
      "/path/[param]": {
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
    });
    const expectedParams = { param: "1" };
    const expectedQueries = { q: "query" };
    const expectedHash = "hash";
    const expectedUrl = `${baseUrl}/path/${expectedParams.param}?${queryString.stringify(expectedQueries)}#${expectedHash}`;

    const url = routes["/path/[param]"].get({
      params: expectedParams,
      queries: expectedQueries,
      hash: expectedHash,
    });

    expect(url).toBe(expectedUrl);
  });
});
