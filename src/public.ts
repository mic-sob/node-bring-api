import { createRequester } from './http.js';
import type { Catalog, Fetch, RequestOptions } from './types.js';

const DEFAULT_WEB_URL = 'https://web.getbring.com/locale/';

export interface PublicResourceOptions extends RequestOptions {
    readonly locale: string;
    readonly fetch?: Fetch;
    readonly baseUrl?: string;
}

export function getCatalog(options: PublicResourceOptions): Promise<Catalog> {
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_WEB_URL,
        fetch: options.fetch
    });

    return request<Catalog>(`catalog.${encodeURIComponent(options.locale)}.json`, {
        signal: options.signal
    });
}

export function getTranslations(options: PublicResourceOptions): Promise<Readonly<Record<string, string>>> {
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_WEB_URL,
        fetch: options.fetch
    });

    return request<Readonly<Record<string, string>>>(`articles.${encodeURIComponent(options.locale)}.json`, {
        signal: options.signal
    });
}
