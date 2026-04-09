Language: [🇺🇸](./README.md) [🇯🇵](./README.ja.md)

[![GitHub Release](https://img.shields.io/github/v/release/yKicchan/routopia)](https://github.com/yKicchan/routopia/releases)
[![license](https://img.shields.io/github/license/yKicchan/routopia)](https://github.com/yKicchan/routopia/blob/main/LICENSE)
[![minzip](https://badgen.net/bundlephobia/minzip/routopia)](https://bundlephobia.com/package/routopia)
[![dependencies](https://badgen.net/bundlephobia/dependency-count/routopia)](https://bundlephobia.com/package/routopia)
[![CI](https://github.com/yKicchan/routopia/actions/workflows/ci.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/ci.yml)
[![Deploy](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml)
[![Coverage](https://ykicchan.github.io/routopia/coverage/badge.svg)](https://ykicchan.github.io/routopia/coverage)

# routopia

> ルート定義にもとづいて、型安全に URL を組み立てられるビルダーライブラリ

![routopia logo](./logo.png)

## ✨ Features

- 🔒 型安全なルート定義とパス構築
- 📦 軽量で依存パッケージなし
- 🥰 型推論と自動補完によるスムーズな開発体験
- 👍 Base URL や可変長パスパラメータといったユースケースにも対応
- 🧩 `template literal types` による厳密な URL 型推論

## 🚀 Getting Started

### 1. Install

```bash
npm install routopia
```

### 2. Define Routes

```ts
import { routes, empty, type } from 'routopia';

export const myRoutes = routes({
  "/users": {
    get: empty,
    post: empty,
  },
  "/path/[id]": {
    get: {
      params: {
        id: type as number,
      },
      queries: {
        q: type as string | undefined,
      },
    },
  },
});
```

### 3. Use Routes

```ts
import { myRoutes } from './path/to/myRoutes';

myRoutes["/users"].get();
myRoutes["/users"].post();
// => "/users"

myRoutes["/path/[id]"].get({ params: { id: 123 } });
// => "/path/123"

myRoutes["/path/[id]"].get({ params: { id: 123 }, queries: { q: "query" }  });
// => "/path/123?q=query"
```

> [!TIP]
> 戻り値はテンプレートリテラル型で詳細に推論されます  
> 例えば `const path = myRoutes["/users"].get()` の場合、 `path` の型は `"/users"` になります。  
> `string` 型で受けたい場合は型注釈を追加してください  
> `const path: string = myRoutes["/users"].get()`

## 📘 Why routopia?

強力な型推論と IDE のオートコンプリート機能により、パスパラメータ、クエリパラメータを含む型安全性を備えたルート定義を提供します。  
他のライブラリとの主な違いは以下の通りです。

- 定義時の補完が効く
- 利用時は曖昧検索のようにパスを絞り込める
- テンプレートリテラル型により詳細な推論が得られる

routopia は宣言的で型安全な簡素な URL の取得に焦点を当てています。  
より高機能な自動生成や正規表現などを欲する方は他のライブラリが良いでしょう。

逆に下記のようなケースでは routopia がマッチしているかもしれません

- サードパーティサイトのリンクや、 SDK 等が存在しないサードパーティ API のエンドポイント管理
- カスタムスキーマを用いた URL の管理(例: `myapp://path/to/resource`)
- 何らかの事情で Open API generator のようなエコシステムを利用していない場合
- Next.js の Route Handlers のような機能を簡素に利用する場合
- 簡単な内部リンクの管理や、Next.js で typedRoutes を利用する場合
- シンプルな URL ビルダーを必要とする場合

## 📖 API Reference

- [No Parameters](#no-parameters)
- [Path Parameters](#path-parameters)
- [Catch-all Parameters](#catch-all-parameters)
- [Query Parameters](#query-parameters)
- [Hash](#hash)
- [Base URL](#base-url)
- [Shorthand](#shorthand)
- [Best Practice](#best-practice)
- [Testing](#testing)

### No Parameters

- パラメータが不要な場合は `empty` を指定

```ts
import { routes, empty } from 'routopia';

const myRoutes = routes({
  "/path": {
    get: empty,
    post: empty,
    put: empty,
    delete: empty,
  },
});

myRoutes["/path"].get();
myRoutes["/path"].post();
myRoutes["/path"].put();
myRoutes["/path"].delete();
// => すべて "/path"
```

### Path Parameters

- `[param]` のように `[]` で囲む
- 複数のパスパラメータも指定可能
- パスパラメータは `params` オブジェクト内で定義
- パスパラメータの型は `string | number` を満たす指定が可能
- パラメータの型は専用の `type` オブジェクトを利用して型アサーション(`type as 型` もしくは `<型>type`)を使って指定する(以降の他パラメータも同様の型指定方法)

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[id]": {
    get: {
      params: {
        id: type as number,
        //  <number>type でも OK
      },
    },
  },
  "/path/[param1]/[param2]": {
    get: {
      params: {
        param1: type as string,
        param2: type as string | number,
      },
    },
  },
});

myRoutes["/path/[id]"].get({ params: { id: 123 } });
// => "/path/123"

myRoutes["/path/[id]"].get({ params: { id: "abc" } });
//                                         ^^^^^
// エラー: number 型に string は割り当てられません

myRoutes["/path/[param1]/[param2]"].get({ 
  params: { param1: "abc", param2: 123 },
});
// => "/path/abc/123"

myRoutes["/path/[id]"].get();
//                     ^^^^
// エラー: パスパラメータは呼び出し時省略不可
```

### Catch-all Parameters

- `[...param]` のようにすることで可変長なパスパラメータを定義可能
- 可変長なパスパラメータは `(string | number)[]` を満たす指定が可能
- `[[...param]]` と二重にした場合は上記に加えて `undefined` を許容
- これは [Next.js の Catch-all Segments](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments) 相当の機能

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[...slug]": {
    get: {
      params: {
        slug: type as string[],
      },
    },
  },
  "/path/[[...slug]]": {
    get: {
      params: {
        slug: type as number[],
      },
    },
  },
});

myRoutes["/path/[...slug]"].get({ 
  params: { slug: ["abc", "def"] },
});
// => "/path/abc/def"

myRoutes["/path/[...slug]"].get();
//                          ^^^^
// エラー: 可変長なパスパラメータは呼び出し時省略不可

myRoutes["/path/[[...slug]]"].get({ 
  params: { slug: [123, 456] },
});
// => "/path/123/456"

myRoutes["/path/[[...slug]]"].get();
// => "/path"
// Optional な可変長なパスパラメータは呼び出し時省略可能
```

### Query Parameters

- クエリパラメータは `queries` オブジェクト内で定義
- クエリパラメータは `object` 以外の型を指定可能
  - `string`, `number`, `boolean`, 配列など
- `undefined` を含めて指定することでオプショナル(省略可能)にできる

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/required": {
    get: {
      queries: {
        str: type as string,
        num: type as number,
        bool: type as boolean,
        arr: type as string[],
        opt: type as string | undefined,
      },
    },
  },
  "/optional": {
    get: {
      queries: {
        str: type as string | undefined,
        num: type as number | undefined,
        bool: type as boolean | undefined,
        arr: type as string[] | undefined,
      },
    },
  },
});

myRoutes["/required"].get({ 
  queries: { 
    str: "abc", 
    num: 123, 
    bool: true, 
    arr: ["a", "b", "c"] 
  },
});
// => "/required?arr=a&arr=b&arr=c&bool=true&num=123&str=abc"

myRoutes["/required"].get();
//                    ^^^
// エラー: オプショナルでないクエリパラメータがあれば省略不可

myRoutes["/optional"].get();
// => "/optional"
```

> [!TIP]
> クエリパラメータの順番はソートされるため URL をキーとして用いる SWR などのキャッシングにも対応しています。

### Hash

- 利用する場合、`hash` キーを定義
- `hash` キーは `string` 型を満たす指定が可能
- 実際の用途では Union の指定が安全だが、`string` を指定してなんでも受け付ける運用も可能
- `hash` キーは `undefined` を入れなくても常に省略可能

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({ 
  "/path": {
    get: {
      hash: type as "anchor1" | "anchor2",
    },
  },
  "/any": {
    get: {
      hash: type as string,
    },
  },
});

myRoutes["/path"].get({ hash: "anchor1" });
// => "/path#anchor1"

myRoutes["/path"].get({ hash: "unknown" });
//                     ^^^^^
// エラー: "anchor1" | "anchor2" に "unknown" は割り当てられません

myRoutes["/any"].get({ hash: "unknown" });
// => "/any#unknown"

myRoutes["/path"].get();
// => "/path"
```

### Base URL

- `routes` 関数には第1引数に文字列を渡すことで Base URL を指定可能
- その場合スキーマ定義は第2引数に指定する
- なお、Base URL は単純に文字列結合される

```ts
import { routes, empty } from 'routopia';

const myUsersRoutes = routes("/users", {
  "/path": {
    get: empty,
  },
});

myUsersRoutes["/path"].get();
// => "/users/path"

const myApiRoutes = routes("https://api.example.com", {
  "/path": {
    get: empty,
  },
});

myApiRoutes["/path"].get();
// => "https://api.example.com/path"
```

### Shorthand

- メソッド定義を省略して直接パラメータを指定可能
- この場合 GET メソッド定義と同じ意味になる

```ts
import { routes, empty, type } from 'routopia';

const myRoutes = routes({
  "/short": empty,
  // = "/short": { get: empty }
  
  "/short/[param]": {
    params: {
      param: type as string,
    },
    queries: {
      q: type as string | undefined,
    },
    hash: type as string,
  },
  // = "/short/[param]": { get: { params: {...}, queries: {...}, hash: ... } }
});

// 利用時は `get` メソッドとして呼び出す
myRoutes["/short"].get();
// => "/short"

myRoutes["/short/[param]"].get({ 
  params: { param: "abc" }, 
  queries: { q: "query" }, 
  hash: "anchor",
});
// => "/short/abc?q=query#anchor"
```

> [!WARNING]
> Shorthand を利用する場合、同一エンドポイント内で他の HTTP メソッド定義と併用はできないよう型レベルで制限しています。  
> 他のエンドポイントとは併記可能ですが、定義ファイルを分割するなどして同一ドメイン内での表記揺れは防止しましょう。
> 
> <details>
> <summary>HTTP メソッド定義と Shorthand の併用に関する実装例</summary>
>
> ```ts
> import { routes, empty, type } from 'routopia';
> 
> // ❌: 同一エンドポイント内は Shorthand 記法と他のメソッド定義の併用不可
> const error = routes({
>   "/short/mixed": {
>     queries: { q: type as string },
>     post: empty,
> //  ^^^^^^^^^^^
>   },
> });
> 
> // ⚠️: 別エンドポイントなら併用可能だが、表記揺れの原因になる
> const notGood = routes({
>   "/hoge": empty,
> //   :
>   "/foo": { get: empty },
> });
> 
> // ✅: 同一ファイル内はエンドポイント間で表記を統一する
> const good = routes({
>   "/hoge": { get: empty },
> //  :
>   "/foo": { get: empty },
> });
> 
> // ✅: または定義ファイルを分割し、ドメインごとに表記を統一する
> // hoge.ts
> const hogeRoutes = routes({
>   "/hoge": empty,
> });
> // foo.ts
> const fooRoutes = routes({
>   "/foo": { get: empty },
> });
> ```
> </details>

### Best practice

- `routopia` をラップして最低限の腐敗防止層を作成しておく
- また一括で Base URL を指定することも可能
- ラップする際の引数の型には `ExpectedSchema` をジェネリクスで利用する
- 必要に応じてドメインごとに定義ファイルを分割して肥大化を防止する

```ts
// createMyApiRoutes.ts
import { routes, empty, type, ExpectedSchema } from 'routopia';

const API_BASE_URL = "https://api.example.com";

export function createMyApiRoutes<T extends ExpectedSchema<T>>(schema: T) {
  return routes(API_BASE_URL, schema);
}

export const schema = { empty, type };
```

```ts
// userRoutes.ts
import { createMyApiRoutes, schema } from './path/to/createMyApiRoutes';

export const userRoutes = createMyApiRoutes({
  "/users": schema.empty,
  "/users/[id]": {
    params: {
      id: schema.type as number,
    },
  },
});
```

```ts
// postRoutes.ts
import { createMyApiRoutes, schema } from './path/to/createMyApiRoutes';

export const postRoutes = createMyApiRoutes({
  "/posts": {
    get: { queries: { q: schema.type as string | undefined } },
  },
  "/posts/[id]": {
    get: { params: { id: schema.type as number } },
    post: { params: { id: schema.type as number } },
    put: { params: { id: schema.type as number } },
    delete: { params: { id: schema.type as number } },
  },
});
```

```ts
// 利用側
import { userRoutes } from './path/to/userRoutes';
import { postRoutes } from './path/to/postRoutes';

userRoutes["/users"].get();
// => "https://api.example.com/users"

postRoutes["/posts/[id]"].get({ params: { id: 123 } });
// => "https://api.example.com/posts/123"
```

> [!WARNING]
> 利便性のために複数のルート定義をまとめるのも可能ですが、TreeShaking が効かなくなるため注意してください
> 
> <details>
> <summary>TreeShaking が効かなくなる実装例</summary>
>
> ```ts
> // index.ts
> import { userRoutes } from './path/to/userRoutes';
> import { postRoutes } from './path/to/postRoutes';
> 
> export const apiRoutes = {
>   ...userRoutes,
>   ...postRoutes,
> };
> 
> // 利用側
> import { apiRoutes } from './path/to/index';
> apiRoutes["/users"].get();
> apiRoutes["/posts/[id]"].get({ params: { id: 123 } });
> // すべてのルートを一律で検索できるが、バンドルサイズは増大する
> ```
> </details>

### Testing

MSW などのモックサーバーを利用する際も、テスト用の URL を組み立てるために `routopia` をそのまま流用することができます。  
テスト向けの柔軟な URL 構築のために、**定義した各パラメータの型制約を緩めた特別な `mock` メソッドを提供**しています。

> [!CAUTION]
> `mock` メソッドを実際のアプリケーションコードで使用しないでください
> エンコードのスキップなど、テスト用の特別な挙動があるため、実際のコードで使用するとセキュリティ上のリスクやバグの原因になります

- `mock` メソッドは、各エンドポイント直下と各 HTTP メソッド定義の直下から呼び出すことが可能
- エンドポイント直下の `mock` メソッドの引数は、すべての HTTP メソッド定義のパラメータを引き継ぐ
- HTTP メソッド直下の `mock` メソッドの引数は、その HTTP メソッド定義のパラメータのみを引き継ぐ
- `mock` メソッドの引数である各パラメータに指定できる型は、定義時に指定できる範囲と同じになる
  - [パスパラメータは `string` | `number` を満たす値](#path-parameters)
  - [可変長なパスパラメータは `string[] | number[]` を満たす値](#catch-all-parameters)
  - [クエリパラメータは `object` 以外を満たす値](#query-parameters)
  - [ハッシュパラメータは `string` を満たす値](#hash)
- `mock` メソッドの引数はすべて省略可能
  - パスパラメータを省略した場合は、コロン構文(例: `:id`)が自動的に設定される
  - 必須の可変長パスパラメータは `:param+`、省略可能な場合は `:param*` になる
- `mock` メソッドは各種パラメータの URL エンコードをしない

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[num]": {
    params: { num: type as number },
    queries: {
      req: type as string,
      opt: type as number | undefined
    }
  }
});

myRoutes["/path/[num]"].mock()
myRoutes["/path/[num]"].get.mock()
// => "/path/:num"

myRoutes["/path/[num]"].mock({ params: { num: "abc" }, queries: { opt: "q" } })
myRoutes["/path/[num]"].get.mock({ params: { num: "abc" }, queries: { opt: "q" } })
// => "/path/abc?opt=q"

Parameters<(typeof myRoutes)["/path/[num]"]["mock"]>
Parameters<(typeof myRoutes)["/path/[num]"]["get"]["mock"]>
// ^? [{
//   params?: { num?: string | number } };
//   queries?: {
//     req?: string | number | boolean | string[]...;
//     opt?: string | number | boolean | string[]...;
//   };
// }]
```

<details>
<summary>More Examples</summary>

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path/[...strArr]": {
    params: { strArr: type as string[] }
  }
});

Parameters<(typeof myRoutes)["/path/[...strArr]"]["mock"]>
Parameters<(typeof myRoutes)["/path/[...strArr]"]["get"]["mock"]>
// ^? [{ params?: { strArr?: string[] | number[] } }]
```

```ts
import { routes, type } from 'routopia';

const myRoutes = routes({
  "/path": {
    get: {
      queries: {
        a: type as string,
        b: type as string
      }
    },
    post: {
      queries: {
        b: type as number,
        c: type as number
      }
    }
  }
});

Parameters<(typeof myRoutes)["/path"]["mock"]>
// ^? [{
//   queries?: {
//     a?: string | number | boolean | string[]...;
//     b?: string | number | boolean | string[]...;
//     c?: string | number | boolean | string[]...;
//   }
// }]

Parameters<(typeof myRoutes)["/path"]["get"]["mock"]>
// ^? [{
//   queries?: {
//     a?: string | number | boolean | string[]...;
//     b?: string | number | boolean | string[]...;
//   }
// }]

Parameters<(typeof myRoutes)["/path"]["post"]["mock"]>
// ^? [{
//   queries?: {
//     b?: string | number | boolean | string[]...;
//     c?: string | number | boolean | string[]...;
//   }
// }]
```
</details>
