import type { Fetch } from './types.js';
export interface RequesterOptions {
    readonly baseUrl: string;
    readonly fetch?: Fetch;
    readonly headers?: HeadersInit;
}
export type Requester = <T>(path: string, init?: RequestInit) => Promise<T>;
export declare function createRequester(options: RequesterOptions): Requester;
//# sourceMappingURL=http.d.ts.map