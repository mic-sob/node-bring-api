# @micsob/bring-api-client

[![NPM version](https://img.shields.io/npm/v/%40micsob%2Fbring-api-client.svg)](https://www.npmjs.com/package/@micsob/bring-api-client)
[![Downloads](https://img.shields.io/npm/dm/%40micsob%2Fbring-api-client.svg)](https://www.npmjs.com/package/@micsob/bring-api-client)
[![Build Status](https://github.com/mic-sob/node-bring-api/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/mic-sob/node-bring-api/actions/workflows/test-and-release.yml)

A zero-dependency, functional TypeScript client for Bring! shopping lists.

> This project uses an undocumented API and is not endorsed by or affiliated with Bring! Labs AG.

## Requirements

- Node.js 22 or newer
- An existing Bring! account for authenticated endpoints

## Installation

```sh
npm install @micsob/bring-api-client
```

## Usage

`connectBring` authenticates and returns a client that is ready to use. There is no constructor and no separate `login()` step.

```js
import { connectBring } from '@micsob/bring-api-client';

const bring = await connectBring({
    email: 'example@example.com',
    password: 'secret'
});

const { lists } = await bring.lists.getAll();
const items = await bring.lists.getItems({ listId: lists[0].listUuid });
```

### Reuse an existing session

Pass a stored session to avoid logging in again:

```js
import { createBringClient } from '@micsob/bring-api-client';

const bring = createBringClient({
    session: {
        userId: process.env.BRING_USER_ID,
        accessToken: process.env.BRING_ACCESS_TOKEN,
        refreshToken: process.env.BRING_REFRESH_TOKEN
    }
});

const { lists } = await bring.lists.getAll();
```

Use `bring.getSession()` after `connectBring()` if the application needs to persist the returned tokens. Do not commit credentials or tokens to source control.

### Public resources

Catalogs and translations do not require authentication or a client:

```js
import { getCatalog, getTranslations } from '@micsob/bring-api-client';

const catalog = await getCatalog({ locale: 'de-DE' });
const translations = await getTranslations({ locale: 'de-DE' });
```

### Change a shopping list

```js
await bring.lists.saveItem({
    listId: '9b3ba561-02ad-4744-a737-c43b7e5b93ec',
    name: 'Coffee',
    specification: 'Whole beans'
});

await bring.lists.moveItemToRecent({
    listId: '9b3ba561-02ad-4744-a737-c43b7e5b93ec',
    name: 'Coffee'
});
```

All operations accept an optional second argument with an `AbortSignal`:

```js
const items = await bring.lists.getItems(
    { listId: '9b3ba561-02ad-4744-a737-c43b7e5b93ec' },
    { signal: AbortSignal.timeout(5_000) }
);
```

## Errors

Failed HTTP responses and network failures reject with a structured `BringApiError`:

```js
import { isBringApiError } from '@micsob/bring-api-client';

try {
    await bring.lists.getAll();
} catch (error) {
    if (isBringApiError(error)) {
        console.error(error.status, error.code, error.message);
    }
}
```

## API overview

- `connectBring(credentials, options?)`
- `authenticate(credentials, options?)`
- `createBringClient({ session, ...options })`
- `bring.lists`: `getAll`, `getItems`, `getItemDetails`, `saveItem`, `removeItem`, `moveItemToRecent`, `getUsers`
- `bring.itemImages`: `save`, `remove`
- `bring.user.getSettings`
- `bring.invitations.getPending`
- `getCatalog(options)`
- `getTranslations(options)`

The optional client configuration supports `baseUrl`, a custom `fetch` implementation, API headers and country selection. All public TypeScript types are exported from the package root.

## Migrating from v2

Version 3 is ESM-only and replaces the stateful `Bring` class:

```diff
- const Bring = require('bring-shopping');
- const bring = new Bring({ mail, password });
- await bring.login();
- const lists = await bring.loadLists();
+ import { connectBring } from '@micsob/bring-api-client';
+ const bring = await connectBring({ email: mail, password });
+ const lists = await bring.lists.getAll();
```

Mutating methods now return `Promise<void>` and reject for non-successful HTTP statuses. Method arguments use named objects and `uuid` arguments are named `listId` or `itemId`.

## Development

The project uses TypeScript 7, Oxlint with type-aware rules and Oxfmt:

```sh
npm ci
npm run check
```

Use `npm run format` to apply the repository formatting rules.

## Credits

This project is a modernized fork of [foxriver76/node-bring-api](https://github.com/foxriver76/node-bring-api), originally created and maintained by [Moritz Heusinger](https://github.com/foxriver76). Thanks to Moritz and all contributors to the original project for building its foundation.

## License

[MIT](LICENSE)
