# Optimal ID
<a id="toc"></a>

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [API Reference](#api-reference)
- [Usage](#usage)
- [License](#license)

## About

`optimal-id` is a small optimized library that generates an optimized string based id value suitable for nosql database unique keys.

It is based upon the research and works of [Peter Zaitsev](https://www.percona.com/blog/2007/03/13/to-uuid-or-not-to-uuid/) and [Karthik Appigatla](https://www.percona.com/blog/2014/12/19/store-uuid-optimized-way/).

Assuming a standard v1 UUID of `"4a6b9f70-b678-11eb-a7b6-032e6afcbc8e"`

This code provides the string `"11ebb6784a6b9f70a7b6032e6afcbc8e"`

- rearranges bytes of timestamp for ordered ids
- removes separator dash characters because we don't need to waste 4 bytes per id
- zero third-party dependency libraries for a smaller payload

## Installation

Install the package into your project.

### Using NPM

```bash
npm install --save optimal-id
```

### Using Yarn Package Manager

```bash
yarn add optimal-id
```

> [Return to Table of Contents](#toc)

## API Reference

- `optimal-id` - module exported from npm package
  - `optId`- interface exported from module
    - `generate` - function that returns optimal ids
      ```typescript
      optId.generate(numIds?: number): OptimalId[]
      ```
  - `OptimalId` - type exported from module if using TypeScript

> [Return to Table of Contents](#toc)

## Usage

### Using JavaScript ES5

```javascript
var optId = require('optimal-id').optId;

// generate one id
var id = optId.generate()[0];

// generate multiple ids
var NUM_IDS_TO_GENERATE = 100;
var ids = optId.generate(NUM_IDS_TO_GENERATE);
```

or

### Using JavaScript ECMAScript 2015 or later

```javascript
const { optId } = require('optimal-id');

// generate one id
const [id] = optId.generate();

// generate multiple ids
const NUM_IDS_TO_GENERATE = 100;
const ids = optId.generate(NUM_IDS_TO_GENERATE);
```

or

### Using Typescript

```typescript
import { optId, OptimalId } from 'optimal-id';

// generate one id
const [id]: OptimalId[] = optId.generate();

// generate multiple ids
const NUM_IDS_TO_GENERATE = 100;
const ids: OptimalId[] = optId.generate(NUM_IDS_TO_GENERATE);
```

> [Return to Table of Contents](#toc)
## License

This library has been developed by Richard Marks, is copyright 2021, and licensed under the MIT License. 

See [LICENSE.md](./LICENSE.md) for full legal details.

> [Return to Table of Contents](#toc)

----

**This library depends on Node.js being built with support for the `crypto` module.**