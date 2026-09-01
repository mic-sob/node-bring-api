import type { Catalog, Fetch, RequestOptions } from './types.js';
export interface PublicResourceOptions extends RequestOptions {
    readonly locale: string;
    readonly fetch?: Fetch;
    readonly baseUrl?: string;
}
export declare function getCatalog(options: PublicResourceOptions): Promise<Catalog>;
export declare function getTranslations(options: PublicResourceOptions): Promise<Readonly<Record<string, string>>>;
//# sourceMappingURL=public.d.ts.map