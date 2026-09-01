import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { connectBring, createBringClient, getCatalog, isBringApiError } from '../build/index.js';

function jsonResponse(body, init = {}) {
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
        ...init
    });
}

describe('authentication', () => {
    it('connects with credentials and returns a ready client', async () => {
        const calls = [];
        const fetch = async (url, init = {}) => {
            calls.push({ url: String(url), init });

            if (String(url).endsWith('/bringauth')) {
                return jsonResponse({
                    name: 'Ada',
                    uuid: 'user-id',
                    access_token: 'access-token',
                    refresh_token: 'refresh-token'
                });
            }

            return jsonResponse({ lists: [] });
        };

        const bring = await connectBring({ email: 'ada@example.com', password: 'secret' }, { fetch });
        const lists = await bring.lists.getAll();

        assert.deepEqual(lists, { lists: [] });
        assert.equal(calls.length, 2);
        assert.equal(calls[1].init.headers.get('authorization'), 'Bearer access-token');
        assert.equal(calls[1].init.headers.get('x-bring-user-uuid'), 'user-id');
    });

    it('uses an existing session without a login request', async () => {
        const calls = [];
        const fetch = async (url, init = {}) => {
            calls.push({ url: String(url), init });
            return jsonResponse({ lists: [] });
        };

        const bring = createBringClient({
            fetch,
            session: {
                userId: 'user-id',
                accessToken: 'access-token'
            }
        });

        await bring.lists.getAll();

        assert.equal(calls.length, 1);
        assert.match(calls[0].url, /bringusers\/user-id\/lists$/);
    });
});

describe('HTTP transport', () => {
    it('encodes item data and treats 204 as void', async () => {
        let request;
        const fetch = async (url, init = {}) => {
            request = { url: String(url), init };
            return new Response(null, { status: 204 });
        };
        const bring = createBringClient({
            fetch,
            session: { userId: 'user-id', accessToken: 'access-token' }
        });

        const result = await bring.lists.saveItem({
            listId: 'list-id',
            name: 'Fish & Chips',
            specification: '50% + sauce'
        });

        assert.equal(result, undefined);
        assert.equal(request.init.method, 'PUT');
        assert.ok(request.init.body instanceof URLSearchParams);
        assert.equal(request.init.body.get('purchase'), 'Fish & Chips');
        assert.equal(request.init.body.get('specification'), '50% + sauce');
    });

    it('discards an unexpected success body for a void operation', async () => {
        const fetch = async () => new Response('ignored', { status: 200 });
        const bring = createBringClient({
            fetch,
            session: { userId: 'user-id', accessToken: 'access-token' }
        });

        const result = await bring.lists.removeItem({
            listId: 'list-id',
            name: 'Coffee'
        });

        assert.equal(result, undefined);
    });

    it('throws a structured error for a non-success status', async () => {
        const fetch = async () =>
            jsonResponse({ message: 'Token expired', error: 'invalid_token', errorcode: 40101 }, { status: 401 });
        const bring = createBringClient({
            fetch,
            session: { userId: 'user-id', accessToken: 'expired' }
        });

        await assert.rejects(bring.lists.getAll(), error => {
            assert.equal(isBringApiError(error), true);
            assert.equal(error.status, 401);
            assert.equal(error.code, 'invalid_token');
            assert.equal(error.message, 'Token expired');
            return true;
        });
    });
});

describe('public resources', () => {
    it('loads a catalog without authentication headers', async () => {
        let request;
        const fetch = async (url, init = {}) => {
            request = { url: String(url), init };
            return jsonResponse({ language: 'de-DE', catalog: { sections: [] } });
        };

        const catalog = await getCatalog({ locale: 'de-DE', fetch });

        assert.equal(catalog.language, 'de-DE');
        assert.equal(new Headers(request.init.headers).has('authorization'), false);
    });
});
