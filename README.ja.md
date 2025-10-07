Language: [🇺🇸](./README.md) [🇯🇵](./README.ja.md)

[![GitHub Release](https://img.shields.io/github/v/release/yKicchan/routopia)](https://github.com/yKicchan/routopia/releases)
[![license](https://img.shields.io/github/license/yKicchan/routopia)](https://github.com/yKicchan/routopia/blob/main/LICENSE)
[![CI](https://github.com/yKicchan/routopia/actions/workflows/ci.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/ci.yml)
[![Deploy](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml/badge.svg)](https://github.com/yKicchan/routopia/actions/workflows/deploy.yml)
[![Coverage](https://ykicchan.github.io/routopia/coverage/badge.svg)](https://ykicchan.github.io/routopia/coverage)

# routopia

> ルート定義にもとづいて、型安全に URL を組み立てられるビルダーライブラリ

![routopia logo](./logo.png)

## ✨ Features

- 🔒 型安全なルート定義とパス構築
- 📦 軽量でフレームワーク非依存
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

const myRoutes = routes({
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

routopia は宣言的で簡素な URL の型安全な取得に焦点を当てています。  
より高機能な自動生成や正規表現などを欲する方は他のライブラリが良いでしょう。

逆に Next.js の API パスや SPA のルーティング、何らかの事情で Open API generator のようなエコシステムを利用していない場合など、シンプルな URL 定義を必要とする場合は、 routopia がマッチしているかもしれません。

## 📖 API Reference

- [No Parameters](#no-parameters)
- [Path Parameters](#path-parameters)
- [Catch-all Parameters](#catch-all-parameters)
- [Query Parameters](#query-parameters)
- [Hash](#hash)
- [Base URL](#base-url)
- [Best Practices](#best-practices)

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
- パスパラメータの型は専用の `type` オブジェクトを利用して型アサーション(`type as 型` もしくは `<型>type`)を使って型を指定
- パスパラメータの型は `string | number` を満たす指定が可能

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
- `[[...param]]` と二重にした場合は上記に加えて `undefined` の指定を許容
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
        slug: type as number[] | undefined,
      },
    },
  },
});

myRoutes["/path/[...slug]"].get({ 
  params: { slug: ["abc", "def"] },
});
// => "/path/abc/def"

myRoutes["/path/[[...slug]]"].get({ 
  params: { slug: [123, 456] },
});
// => "/path/123/456"

myRoutes["/path/[[...slug]]"].get();
// => "/path"
```

### Query Parameters

- クエリパラメータは `queries` オブジェクト内で定義
- クエリパラメータは `object` 以外の型を指定可能
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

### Best practice

- `routopia` をラップしておくことで腐敗防止層を作成する
- また一括で Base URL を指定することも可能
- ラップする際の引数の型には `ExpectedSchema` をジェネリクスで利用する

```ts
import { routes, empty, type, ExpectedSchema } from 'routopia';

const API_BASE_URL = "https://api.example.com";

export function createMyApiRoutes<T extends ExpectedSchema<T>>(schema: T) {
  return routes(API_BASE_URL, schema);
}

export const schema = { empty, type };
```

```ts
import { createMyApiRoutes, schema } from './path/to/createMyApiRoutes';

export const userRoutes = createMyApiRoutes({
  "/users": {
    get: schema.empty,
  },
  "/users/[id]": {
    get: {
      params: {
        id: schema.type as number,
      },
    },
  },
});
```

```ts
import { userRoutes } from './path/to/userRoutes';

userRoutes["/users"].get();
// => "https://api.example.com/users"
```
