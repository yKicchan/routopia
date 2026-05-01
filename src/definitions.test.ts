import schema from ".";
import { stringifyQueries } from "./utilities";

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
          params: schema.type as string[],
        },
      },
    },
    "/params/[param]/[...params1]/[[...params2]]": {
      get: {
        params: {
          param: schema.type as string,
          params1: schema.type as string[],
          params2: schema.type as string[],
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
        hash: schema.type as "section" | "hash with space",
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
        hash: schema.type as "hash",
      },
    },
    "/short/empty": schema.empty,
    "/short/all/[param]": {
      params: {
        param: schema.type as string,
      },
      queries: {
        required: schema.type as string,
      },
      hash: schema.type as "hash",
    },
    "/short/all/[[...params]]": {
      params: {
        params: schema.type as string[],
      },
      queries: {
        optional: schema.type as string | undefined,
      },
      hash: schema.type as "hash",
    },

    "/mock/[param]": {
      get: {
        params: {
          param: schema.type as string,
        },
        queries: {
          str: schema.type as string,
          both: schema.type as string,
        },
        hash: "hash1",
      },
      post: {
        params: {
          param: schema.type as number,
        },
        queries: {
          num: schema.type as number,
          both: schema.type as number,
        },
        hash: "hash2",
      },
    },
  });

  it("各エンドポイントに対応するオブジェクトが生成されること", () => {
    expect(routes).toHaveProperty("/methods");
    expect(routes).toHaveProperty("/params/[param]");
    expect(routes).toHaveProperty("/params/[param1]/[param2]");
    expect(routes).toHaveProperty("/params/[...params]");
    expect(routes).toHaveProperty("/params/[[...params]]");
    expect(routes).toHaveProperty("/queries/required");
    expect(routes).toHaveProperty("/queries/both");
    expect(routes).toHaveProperty("/queries/optional");
    expect(routes).toHaveProperty("/hash");
    expect(routes).toHaveProperty("/all/[param]");

    expect(routes).toHaveProperty("/short/empty");
    expect(routes).toHaveProperty("/short/all/[param]");
    expect(routes).toHaveProperty("/short/all/[[...params]]");

    expect(routes).toHaveProperty("/mock/[param]");
  });

  it("各エンドポイントに対応するすべての HTTP メソッドが生成されること", () => {
    expect(routes["/methods"].get).toBeInstanceOf(Function);
    expect(routes["/methods"].post).toBeInstanceOf(Function);
    expect(routes["/methods"].put).toBeInstanceOf(Function);
    expect(routes["/methods"].delete).toBeInstanceOf(Function);

    expect(routes["/params/[param]"].get).toBeInstanceOf(Function);
    expect(routes["/params/[param1]/[param2]"].get).toBeInstanceOf(Function);
    expect(routes["/params/[...params]"].get).toBeInstanceOf(Function);
    expect(routes["/params/[[...params]]"].get).toBeInstanceOf(Function);
    expect(routes["/queries/required"].get).toBeInstanceOf(Function);
    expect(routes["/queries/both"].get).toBeInstanceOf(Function);
    expect(routes["/queries/optional"].get).toBeInstanceOf(Function);
    expect(routes["/hash"].get).toBeInstanceOf(Function);
    expect(routes["/all/[param]"].get).toBeInstanceOf(Function);

    expect(routes["/short/empty"].get).toBeInstanceOf(Function);
    expect(routes["/short/all/[param]"].get).toBeInstanceOf(Function);
    expect(routes["/short/all/[[...params]]"].get).toBeInstanceOf(Function);

    expect(routes["/mock/[param]"].get).toBeInstanceOf(Function);
    expect(routes["/mock/[param]"].post).toBeInstanceOf(Function);
  });

  it("各エンドポイントと HTTP メソッドには mock 関数が生成されること", () => {
    expect(routes["/methods"].mock).toBeInstanceOf(Function);
    expect(routes["/methods"].get.mock).toBeInstanceOf(Function);
    expect(routes["/methods"].post.mock).toBeInstanceOf(Function);
    expect(routes["/methods"].put.mock).toBeInstanceOf(Function);
    expect(routes["/methods"].delete.mock).toBeInstanceOf(Function);

    expect(routes["/params/[param]"].mock).toBeInstanceOf(Function);
    expect(routes["/params/[param]"].get.mock).toBeInstanceOf(Function);
    expect(routes["/params/[param1]/[param2]"].mock).toBeInstanceOf(Function);
    expect(routes["/params/[param1]/[param2]"].get.mock).toBeInstanceOf(Function);
    expect(routes["/params/[...params]"].mock).toBeInstanceOf(Function);
    expect(routes["/params/[...params]"].get.mock).toBeInstanceOf(Function);
    expect(routes["/params/[[...params]]"].mock).toBeInstanceOf(Function);
    expect(routes["/params/[[...params]]"].get.mock).toBeInstanceOf(Function);

    expect(routes["/queries/required"].mock).toBeInstanceOf(Function);
    expect(routes["/queries/required"].get.mock).toBeInstanceOf(Function);
    expect(routes["/queries/both"].mock).toBeInstanceOf(Function);
    expect(routes["/queries/both"].get.mock).toBeInstanceOf(Function);
    expect(routes["/queries/optional"].mock).toBeInstanceOf(Function);
    expect(routes["/queries/optional"].get.mock).toBeInstanceOf(Function);

    expect(routes["/hash"].mock).toBeInstanceOf(Function);
    expect(routes["/hash"].get.mock).toBeInstanceOf(Function);

    expect(routes["/all/[param]"].mock).toBeInstanceOf(Function);
    expect(routes["/all/[param]"].get.mock).toBeInstanceOf(Function);

    expect(routes["/short/empty"].mock).toBeInstanceOf(Function);
    expect(routes["/short/empty"].get.mock).toBeInstanceOf(Function);
    expect(routes["/short/all/[param]"].mock).toBeInstanceOf(Function);
    expect(routes["/short/all/[param]"].get.mock).toBeInstanceOf(Function);
    expect(routes["/short/all/[[...params]]"].mock).toBeInstanceOf(Function);
    expect(routes["/short/all/[[...params]]"].get.mock).toBeInstanceOf(Function);
  });

  describe("HTTP メソッドに必要なパラメータがない(empty で宣言されている)場合", () => {
    it("引数なしで URL を生成できること", () => {
      const expectedUrl = "/methods";

      const url = routes["/methods"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数も引数なしで URL を生成できること", () => {
      const expectedUrl = "/methods";

      const url1 = routes["/methods"].mock();
      const url2 = routes["/methods"].get.mock();

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });
  });

  describe("パスパラメータが宣言されている場合", () => {
    it("パスパラメータを指定して URL を生成できること", () => {
      const options = { params: { param: "1" } };
      const expectedUrl = "/params/1";

      const url = routes["/params/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("複数のパスパラメータを指定して URL を生成できること", () => {
      const options = { params: { param1: "1", param2: "2" } };
      const expectedUrl = "/params/1/2";

      const url = routes["/params/[param1]/[param2]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長なパスパラメータを指定して URL を生成できること", () => {
      const options = { params: { params: ["1", "2"] } };
      const expectedUrl = "/params/1/2";

      const url = routes["/params/[...params]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパスパラメータを指定して URL を生成できること", () => {
      const options = { params: { params: ["1", "2"] } };
      const expectedUrl = "/params/1/2";

      const url = routes["/params/[[...params]]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長なパスパラメータを省略して URL を生成できること", () => {
      const expectedUrl = "/params";

      const url = routes["/params/[[...params]]"].get();

      expect(url).toBe(expectedUrl);
    });

    it("パスパラメータはエンコードされること", () => {
      const options = {
        params: {
          param: "あ",
          params1: ["か", "き"],
          params2: ["さ", "し"],
        },
      };
      const expectedUrl = "/params/%E3%81%82/%E3%81%8B/%E3%81%8D/%E3%81%95/%E3%81%97";

      const url = routes["/params/[param]/[...params1]/[[...params2]]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数はパスパラメータを省略してコロン形式のキーマッチングが設定された URL を生成できること", () => {
      const expectedUrl1 = "/params/:param";
      expect(routes["/params/[param]"].mock()).toBe(expectedUrl1);
      expect(routes["/params/[param]"].get.mock()).toBe(expectedUrl1);

      const expectedUrl2 = "/params/:param1/:param2";
      expect(routes["/params/[param1]/[param2]"].mock()).toBe(expectedUrl2);
      expect(routes["/params/[param1]/[param2]"].get.mock()).toBe(expectedUrl2);

      const expectedUrl3 = "/params/:params+";
      expect(routes["/params/[...params]"].mock()).toBe(expectedUrl3);
      expect(routes["/params/[...params]"].get.mock()).toBe(expectedUrl3);

      const expectedUrl4 = "/params/:params*";
      expect(routes["/params/[[...params]]"].mock()).toBe(expectedUrl4);
      expect(routes["/params/[[...params]]"].get.mock()).toBe(expectedUrl4);
    });

    it("mock 関数は自由にパスパラメータを指定して URL を生成でき、エンコードされないこと", () => {
      const options1 = { params: { param: "1 2 3" } };
      const expectedUrl1 = "/params/1 2 3";
      expect(routes["/params/[param]"].mock(options1)).toBe(expectedUrl1);
      expect(routes["/params/[param]"].get.mock(options1)).toBe(expectedUrl1);

      const options2 = { params: { param1: "あ", param2: 2 } };
      const expectedUrl2 = "/params/あ/2";
      expect(routes["/params/[param1]/[param2]"].mock(options2)).toBe(expectedUrl2);
      expect(routes["/params/[param1]/[param2]"].get.mock(options2)).toBe(expectedUrl2);

      const options3 = { params: { params: [1, "あいう", 2] } };
      const expectedUrl3 = "/params/1/あいう/2";
      expect(routes["/params/[...params]"].mock(options3)).toBe(expectedUrl3);
      expect(routes["/params/[...params]"].get.mock(options3)).toBe(expectedUrl3);
      expect(routes["/params/[[...params]]"].mock(options3)).toBe(expectedUrl3);
      expect(routes["/params/[[...params]]"].get.mock(options3)).toBe(expectedUrl3);
    });
  });

  describe("クエリパラメータが宣言されている場合", () => {
    it("ソートされたクエリパラメータ付きの URL を生成できること", () => {
      const options = {
        queries: {
          string: "string",
          number: 1,
          boolean: true,
          array: ["string"],
        },
      };
      const expectedUrl = "/queries/required?array=string&boolean=true&number=1&string=string";

      const url = routes["/queries/required"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("オプショナルなクエリパラメータは省略して URL を生成できること", () => {
      const options = {
        queries: {
          string: "string",
          number: 1,
        },
      };
      const expectedUrl = "/queries/both?number=1&string=string";

      const url = routes["/queries/both"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("パラメータが全て省略可能な場合は、引数なしで URL を生成できること", () => {
      const expectedUrl = "/queries/optional";

      const url = routes["/queries/optional"].get();

      expect(url).toBe(expectedUrl);
    });

    it("エンコードされること", () => {
      const options = {
        queries: {
          string: "string with space",
        },
      };
      const expectedUrl = "/queries/optional?string=string%20with%20space";

      const url = routes["/queries/optional"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数は常にクエリパラメータを省略して URL を生成できること", () => {
      const expectedUrl1 = "/queries/required";

      const url1 = routes["/queries/required"].mock();
      const url2 = routes["/queries/required"].get.mock();

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const expectedUrl2 = "/queries/both";

      const url3 = routes["/queries/both"].mock();
      const url4 = routes["/queries/both"].get.mock();

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);

      const expectedUrl3 = "/queries/optional";

      const url5 = routes["/queries/optional"].mock();
      const url6 = routes["/queries/optional"].get.mock();

      expect(url5).toBe(expectedUrl3);
      expect(url6).toBe(expectedUrl3);
    });

    it("mock 関数は自由にクエリパラメータを指定して URL を生成でき、エンコードされないこと", () => {
      const options = {
        queries: {
          string: 123,
          number: true,
          boolean: [1, 2, 3],
          array: "s t r",
        },
      };
      const expectedQueryString = "?array=s t r&boolean=1&boolean=2&boolean=3&number=true&string=123";
      const expectedUrl1 = `/queries/required${expectedQueryString}`;

      const url1 = routes["/queries/required"].mock(options);
      const url2 = routes["/queries/required"].get.mock(options);

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const expectedUrl2 = `/queries/both${expectedQueryString}`;

      const url3 = routes["/queries/both"].mock(options);
      const url4 = routes["/queries/both"].get.mock(options);

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);

      const expectedUrl3 = `/queries/optional${expectedQueryString}`;

      const url5 = routes["/queries/optional"].mock(options);
      const url6 = routes["/queries/optional"].get.mock(options);

      expect(url5).toBe(expectedUrl3);
      expect(url6).toBe(expectedUrl3);
    });
  });

  describe("ハッシュが宣言されている場合", () => {
    it("ハッシュを指定して URL を生成できること", () => {
      const expectedUrl = "/hash#section";

      const url = routes["/hash"].get({ hash: "section" });

      expect(url).toBe(expectedUrl);
    });

    it("エンコードされること", () => {
      const expectedUrl = "/hash#hash%20with%20space";

      const url = routes["/hash"].get({ hash: "hash with space" });

      expect(url).toBe(expectedUrl);
    });

    it("ハッシュパラメータを指定せずに URL を生成できること", () => {
      const expectedUrl = "/hash";

      const url = routes["/hash"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数もハッシュを省略して URL を生成できること", () => {
      const expectedUrl = "/hash";

      const url1 = routes["/hash"].mock();
      const url2 = routes["/hash"].get.mock();

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });

    it("mock 関数は自由にハッシュを指定して URL を生成でき、エンコードされないこと", () => {
      const options = {
        hash: "un known",
      };
      const expectedUrl = "/hash#un known";

      const url1 = routes["/hash"].mock(options);
      const url2 = routes["/hash"].get.mock(options);

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });
  });

  describe("すべてのパラメータが宣言されている場合", () => {
    it("パスパラメータとクエリパラメータとハッシュを指定して URL を生成できること", () => {
      const options = {
        params: { param: "1" },
        queries: { optional: "optional" },
        hash: "hash" as const,
      };
      const expectedUrl = "/all/1?optional=optional#hash";

      const url = routes["/all/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("オプショナルなパラメータは指定なしで URL を生成できること", () => {
      const options = { params: { param: "1" } };
      const expectedUrl = "/all/1";

      const url = routes["/all/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数はすべてのパラメータを省略して URL を生成できること", () => {
      const expectedUrl = "/all/:param";

      const url1 = routes["/all/[param]"].mock();
      const url2 = routes["/all/[param]"].get.mock();

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });

    it("mock 関数はすべてのパラメータを自由に指定して URL を生成できること", () => {
      const options = {
        params: { param: 123 },
        queries: { optional: true },
        hash: "unknown",
      };
      const expectedUrl = "/all/123?optional=true#unknown";

      const url1 = routes["/all/[param]"].mock(options);
      const url2 = routes["/all/[param]"].get.mock(options);

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });
  });

  describe("ショートハンド宣言(HttpMethod が省略されているとき)の場合", () => {
    it("引数なしで URL を生成できること", () => {
      const expectedUrl = "/short/empty";

      const url = routes["/short/empty"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数も引数なしで URL を生成できること", () => {
      const expectedUrl = "/short/empty";

      const url1 = routes["/short/empty"].mock();
      const url2 = routes["/short/empty"].get.mock();

      expect(url1).toBe(expectedUrl);
      expect(url2).toBe(expectedUrl);
    });

    it("すべてのパラメータを指定して URL を生成できること", () => {
      const options = {
        params: { param: "1" },
        queries: { required: "required" },
        hash: "hash" as const,
      };
      const expectedUrl = "/short/all/1?required=required#hash";

      const url = routes["/short/all/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("オプショナルなパラメータは指定なしで URL を生成できること", () => {
      const expectedUrl = "/short/all";

      const url = routes["/short/all/[[...params]]"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数はすべてのパラメータを省略して URL を生成できること", () => {
      const expectedUrl1 = "/short/all/:param";

      const url1 = routes["/short/all/[param]"].mock();
      const url2 = routes["/short/all/[param]"].get.mock();

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const expectedUrl2 = "/short/all/:params*";

      const url3 = routes["/short/all/[[...params]]"].mock();
      const url4 = routes["/short/all/[[...params]]"].get.mock();

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);
    });

    it("mock 関数はすべてのパラメータを自由に指定して URL を生成できること", () => {
      const options1 = {
        params: { param: 123 },
        queries: { required: 123 },
        hash: "unknown",
      };
      const expectedUrl1 = "/short/all/123?required=123#unknown";

      const url1 = routes["/short/all/[param]"].mock(options1);
      const url2 = routes["/short/all/[param]"].get.mock(options1);

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const options2 = {
        params: { params: [1, 2, 3] },
        queries: { optional: 123 },
        hash: "unknown",
      };
      const expectedUrl2 = "/short/all/1/2/3?optional=123#unknown";

      const url3 = routes["/short/all/[[...params]]"].mock(options2);
      const url4 = routes["/short/all/[[...params]]"].get.mock(options2);

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);
    });
  });
});

describe("routes: baseUrl", () => {
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

  it("baseUrl がついた URL を生成できること", () => {
    const options = {
      params: { param: "1" },
      queries: { q: "query" },
      hash: "hash",
    };
    const expectedUrl = `${baseUrl}/path/1${stringifyQueries(options.queries)}#hash`;

    const url = routes["/path/[param]"].get(options);

    expect(url).toBe(expectedUrl);
  });

  it("mock 関数も baseUrl がついた URL を生成できること", () => {
    const expectedUrl1 = `${baseUrl}/path/:param`;

    const url1 = routes["/path/[param]"].mock();
    const url2 = routes["/path/[param]"].get.mock();

    expect(url1).toBe(expectedUrl1);
    expect(url2).toBe(expectedUrl1);

    const options = {
      params: { param: 123 },
      queries: { q: 456 },
      hash: "hash",
    };
    const expectedUrl2 = `${baseUrl}/path/123${stringifyQueries(options.queries, true)}#hash`;

    const url3 = routes["/path/[param]"].mock(options);
    const url4 = routes["/path/[param]"].get.mock(options);

    expect(url3).toBe(expectedUrl2);
    expect(url4).toBe(expectedUrl2);
  });
});

describe("routes: custom scheme", () => {
  describe("baseUrl なし", () => {
    const routes = schema.routes({
      "schema://empty": schema.empty,
      "schema://params/[param]": {
        params: {
          param: schema.type as string,
        },
      },
      "schema://params/[...params]": {
        params: {
          params: schema.type as string[],
        },
      },
      "schema://params/[[...params]]": {
        params: {
          params: schema.type as string[],
        },
      },
      "schema://https://example.com/path/[param]": {
        params: {
          param: schema.type as string,
        },
      },
    });

    it("スラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl = "schema://empty";

      const url = routes["schema://empty"].get();

      expect(url).toBe(expectedUrl);
    });

    it("パラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const options = { params: { param: "1" } };
      const expectedUrl = "schema://params/1";

      const url = routes["schema://params/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長パラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const options = { params: { params: ["1", "2"] } };
      const expectedUrl = "schema://params/1/2";

      const url = routes["schema://params/[...params]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const options = { params: { params: ["1", "2"] } };
      const expectedUrl = "schema://params/1/2";

      const url = routes["schema://params/[[...params]]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパラメータを省略してもスラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl = "schema://params";

      const url = routes["schema://params/[[...params]]"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数もスラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl1 = "schema://empty";

      const url1 = routes["schema://empty"].mock();
      const url2 = routes["schema://empty"].get.mock();

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const expectedUrl2 = "schema://params/:param";

      const url3 = routes["schema://params/[param]"].mock();
      const url4 = routes["schema://params/[param]"].get.mock();
      const url5 = routes["schema://params/[...params]"].mock();
      const url6 = routes["schema://params/[...params]"].get.mock();
      const url7 = routes["schema://params/[[...params]]"].mock();
      const url8 = routes["schema://params/[[...params]]"].get.mock();

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);

      const expectedUrl3 = "schema://params/:params+";
      expect(url5).toBe(expectedUrl3);
      expect(url6).toBe(expectedUrl3);

      const expectedUrl4 = "schema://params/:params*";
      expect(url7).toBe(expectedUrl4);
      expect(url8).toBe(expectedUrl4);
    });

    it("2重スキーマもスラッシュが変わらずに URL を生成できること", () => {
      const options = { params: { param: "1" } };
      const expectedUrl = "schema://https://example.com/path/1";

      const url = routes["schema://https://example.com/path/[param]"].get(options);

      expect(url).toBe(expectedUrl);
    });
  });

  describe("baseUrl あり", () => {
    const baseUrl = "schema://";
    const routes = schema.routes(baseUrl, {
      empty: schema.empty,
      "params/[param]": {
        params: {
          param: schema.type as string,
        },
      },
      "params/[...params]": {
        params: {
          params: schema.type as string[],
        },
      },
      "params/[[...params]]": {
        params: {
          params: schema.type as string[],
        },
      },
    });

    it("baseUrl があってもスラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl = `${baseUrl}empty`;

      // biome-ignore lint/complexity/useLiteralKeys:
      const url = routes["empty"].get();

      expect(url).toBe(expectedUrl);
    });

    it("パラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const expectedParams = { param: "1" };
      const expectedPath = `params/${expectedParams.param}`;
      const expectedUrl = `${baseUrl}${expectedPath}`;

      const url = routes["params/[param]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("可変長パラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const expectedParams = { params: ["1", "2"] };
      const expectedPath = `params/${expectedParams.params.join("/")}`;
      const expectedUrl = `${baseUrl}${expectedPath}`;

      const url = routes["params/[...params]"].get({
        params: expectedParams,
      });

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパラメータがあってもスラッシュが変わらずに URL を生成できること", () => {
      const options = { params: { params: ["1", "2"] } };
      const expectedUrl = `${baseUrl}params/1/2`;

      const url = routes["params/[[...params]]"].get(options);

      expect(url).toBe(expectedUrl);
    });

    it("可変長でオプショナルなパラメータを省略してもスラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl = `${baseUrl}params`;

      const url = routes["params/[[...params]]"].get();

      expect(url).toBe(expectedUrl);
    });

    it("mock 関数もスラッシュが変わらずに URL を生成できること", () => {
      const expectedUrl1 = `${baseUrl}empty`;

      // biome-ignore lint/complexity/useLiteralKeys:
      const url1 = routes["empty"].mock();
      // biome-ignore lint/complexity/useLiteralKeys:
      const url2 = routes["empty"].get.mock();

      expect(url1).toBe(expectedUrl1);
      expect(url2).toBe(expectedUrl1);

      const expectedUrl2 = `${baseUrl}params/:param`;

      const url3 = routes["params/[param]"].mock();
      const url4 = routes["params/[param]"].get.mock();
      const url5 = routes["params/[...params]"].mock();
      const url6 = routes["params/[...params]"].get.mock();
      const url7 = routes["params/[[...params]]"].mock();
      const url8 = routes["params/[[...params]]"].get.mock();

      expect(url3).toBe(expectedUrl2);
      expect(url4).toBe(expectedUrl2);

      const expectedUrl3 = `${baseUrl}params/:params+`;
      expect(url5).toBe(expectedUrl3);
      expect(url6).toBe(expectedUrl3);

      const expectedUrl4 = `${baseUrl}params/:params*`;
      expect(url7).toBe(expectedUrl4);
      expect(url8).toBe(expectedUrl4);
    });
  });
});
