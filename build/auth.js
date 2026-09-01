import { createBringApiError } from './errors.js';
import { createRequester } from './http.js';
const DEFAULT_API_URL = 'https://api.getbring.com/rest/v2/';
function isAuthResponse(value) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const response = value;
    return (typeof response.name === 'string' &&
        typeof response.uuid === 'string' &&
        typeof response.access_token === 'string' &&
        (response.refresh_token === undefined || typeof response.refresh_token === 'string'));
}
export async function authenticate(credentials, options = {}) {
    const request = createRequester({
        baseUrl: options.baseUrl ?? DEFAULT_API_URL,
        fetch: options.fetch
    });
    const response = await request('bringauth', {
        method: 'POST',
        signal: options.signal,
        body: new URLSearchParams({
            email: credentials.email,
            password: credentials.password
        })
    });
    if (!isAuthResponse(response)) {
        throw createBringApiError('Bring API returned an invalid authentication response', {
            code: 'INVALID_RESPONSE',
            body: response
        });
    }
    return {
        userId: response.uuid,
        userName: response.name,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
    };
}
export { DEFAULT_API_URL };
//# sourceMappingURL=auth.js.map