import { createBringApiError, isBringApiError } from './errors.js';
import type { Fetch } from './types.js';

export interface RequesterOptions {
    readonly baseUrl: string;
    readonly fetch?: Fetch;
    readonly headers?: HeadersInit;
}

export type Requester = <T>(path: string, init?: RequestInit) => Promise<T>;

interface ApiErrorBody {
    readonly message?: unknown;
    readonly error?: unknown;
    readonly error_description?: unknown;
    readonly errorcode?: unknown;
}

function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
    return isRecord(value) && typeof value.error === 'string';
}

async function readBody(response: Response): Promise<unknown> {
    if (response.status === 204 || response.status === 205) {
        return undefined;
    }

    const text = await response.text();
    if (text.length === 0) {
        return undefined;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('json')) {
        try {
            return JSON.parse(text) as unknown;
        } catch (cause) {
            throw createBringApiError('Bring API returned invalid JSON', {
                status: response.status,
                code: 'INVALID_RESPONSE',
                body: text,
                cause
            });
        }
    }

    return text;
}

function errorFromResponse(response: Response, body: unknown) {
    const apiError = isApiErrorBody(body) ? body : undefined;
    const message =
        (typeof apiError?.message === 'string' && apiError.message) ||
        (typeof apiError?.error_description === 'string' && apiError.error_description) ||
        `Bring API request failed with status ${response.status}`;

    return createBringApiError(message, {
        status: response.status,
        code: typeof apiError?.error === 'string' ? apiError.error : undefined,
        apiCode: typeof apiError?.errorcode === 'number' ? apiError.errorcode : undefined,
        body
    });
}

export function createRequester(options: RequesterOptions): Requester {
    const fetchImplementation = options.fetch ?? globalThis.fetch;
    const baseUrl = normalizeBaseUrl(options.baseUrl);
    const defaultHeaders = new Headers(options.headers);

    return async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const headers = new Headers(defaultHeaders);
        new Headers(init.headers).forEach((value, key) => headers.set(key, value));

        let response: Response;
        try {
            response = await fetchImplementation(new URL(path, baseUrl), { ...init, headers });
        } catch (cause) {
            if (isBringApiError(cause)) {
                throw cause;
            }

            throw createBringApiError('Cannot connect to Bring API', {
                code: 'NETWORK_ERROR',
                cause
            });
        }

        const body = await readBody(response);
        if (!response.ok || isApiErrorBody(body)) {
            throw errorFromResponse(response, body);
        }

        return body as T;
    };
}
