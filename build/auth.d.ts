import type { BringSession, ConnectOptions, Credentials } from './types.js';
declare const DEFAULT_API_URL = "https://api.getbring.com/rest/v2/";
export declare function authenticate(credentials: Credentials, options?: Pick<ConnectOptions, 'baseUrl' | 'fetch' | 'signal'>): Promise<BringSession>;
export { DEFAULT_API_URL };
//# sourceMappingURL=auth.d.ts.map