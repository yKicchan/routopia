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
- 🔧 SPA のルーティングや API エンドポイントの定義に

## 🚀 Getting Started

### Install

```bash
npm install routopia
```

### Define Routes

```ts
import routopia from 'routopia';

const myRoutes = routopia.routes({
  "/users": {
    // パラメータなし
    get: routopia.empty,
  },
  "/path/[id]": {
    get: {
      params: {
        id: routopia.type as number,
      },
      queries: {
        // クエリはオプショナル指定が可能
        q: routopia.type as string | undefined,
      },
    },
  },
});
```

### Use Routes

```ts
myRoutes["/users"].get();
// => "/users"

myRoutes["/path/[id]"].get({ params: { id: 123 }, queries: { q: "query" }  });
// => "/path/123?q=query"
```

> [!TIP]
> 戻り値はテンプレートリテラル型で詳細に推論されます
> 例えば `const path = myRoutes["/users"].get()` の場合、 `path` の型は `"/users"` になります。
> `string` 型で受けたい場合は型注釈を追加してください
> `const path: string = myRoutes["/users"].get()`

## 🌐 Include Base URL

```ts
import routopia from 'routopia';

const myApiRoutes = routopia.routes("https://api.example.com", {
  "/users": {
    get: routopia.empty,
  }
});

myApiRoutes["/users"].get();
// => "https://api.example.com/users"
```

### Best practice

```ts
import { routes, ExpectedSchema } from 'routopia';

export function createMyApiRoutes<T extends ExpectedSchema<T>>(schema: T) {
  return routes("https://api.example.com", schema);
}
```

```ts
import routopia from 'routopia';
import { createMyApiRoutes } from './path/to/createMyApiRoutes';

const usersApiRoutes = createMyApiRoutes({
  "/users": {
    get: routopia.empty,
  }
});

usersApiRoutes["/users"].get();
// => "https://api.example.com/users"
```

## 📘 Why routopia?

強力な型推論と IDE のオートコンプリート機能により、パスパラメータ、クエリパラメータを含む型安全性を備えたルート定義を提供します。  
他のライブラリとの主な違いは以下の通りです。

- 定義時の補完が効く
- 利用時は曖昧検索のようにパスを絞り込める
- テンプレートリテラル型により詳細な推論が得られる

routopia は宣言的で簡素な URL の型安全な取得に焦点を当てています。  
より高機能な自動生成や正規表現などを欲する方は他のライブラリが良いでしょう。

逆に Next.js の API パスや SPA のルーティング、何らかの事情で Open API generator のようなエコシステムを利用していない場合など、シンプルな URL 定義を必要とする場合は、 routopia がマッチしているかもしれません。