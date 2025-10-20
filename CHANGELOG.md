# routopia

## 1.1.0

### Minor Changes

- [#4](https://github.com/yKicchan/routopia/pull/4) [`c6905e5`](https://github.com/yKicchan/routopia/commit/c6905e54f59460004fd58818a404bc8d2a64a493) Thanks [@yKicchan](https://github.com/yKicchan)! - Add custom schema support for endpoints

  Endpoints can now include custom schemas (e.g., `custom://path/to/resource`) which are properly preserved during URL generation.

### Patch Changes

- [#3](https://github.com/yKicchan/routopia/pull/3) [`3fe96a1`](https://github.com/yKicchan/routopia/commit/3fe96a1b7ea4db96506bda31c24abff100973f5d) Thanks [@yKicchan](https://github.com/yKicchan)! - Fix type inference for catch-all parameters without 'as const'

  Previously, catch-all parameters ([...params]) were incorrectly ignored during type inference when not using 'as const', causing the parameter segments to be omitted from the return type. Now:

  - `myRoutes["/params/[...params]"].get({ params: ["1"] })` correctly returns `/params/${string}` instead of `/params`
  - `myRoutes["/params/[...params]"].get({ params: ["1"] as const })` continues to return `/params/1`

## 1.0.0

### Major Changes

- [`d855796`](https://github.com/yKicchan/routopia/commit/d855796703fc99dda552e844e6b114f0c970ab3c) Thanks [@yKicchan](https://github.com/yKicchan)! - No dependencies

### Minor Changes

- [`fe0c4c5`](https://github.com/yKicchan/routopia/commit/fe0c4c5a51a9f82b4f6c61ab02ce5e6ddb6fa55f) Thanks [@yKicchan](https://github.com/yKicchan)! - Optional catch all routes now allow undefined to be omitted in path parameter type definitions

- [`4a106a8`](https://github.com/yKicchan/routopia/commit/4a106a82cb72a814783181802b8e6b406218a268) Thanks [@yKicchan](https://github.com/yKicchan)! - Implemented shorthand syntax for defining GET methods.

### Patch Changes

- [`dfa4418`](https://github.com/yKicchan/routopia/commit/dfa4418150e830bcd6c2f7f9bd406c5955f77080) Thanks [@yKicchan](https://github.com/yKicchan)! - Security update
