import { createRequester } from './http.js';
const DEFAULT_WEB_URL = 'https://web.getbring.com/locale/';
export function getCatalog(options) {
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_WEB_URL,
        fetch: options.fetch
    });
    return request(`catalog.${encodeURIComponent(options.locale)}.json`, {
        signal: options.signal
    });
}
export function getTranslations(options) {
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_WEB_URL,
        fetch: options.fetch
    });
    return request(`articles.${encodeURIComponent(options.locale)}.json`, {
        signal: options.signal
    });
}
//# sourceMappingURL=public.js.map