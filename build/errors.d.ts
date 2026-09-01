export interface BringApiError extends Error {
    readonly name: 'BringApiError';
    readonly status?: number;
    readonly code?: string;
    readonly apiCode?: number;
    readonly body?: unknown;
}
interface ErrorOptions {
    readonly status?: number;
    readonly code?: string;
    readonly apiCode?: number;
    readonly body?: unknown;
    readonly cause?: unknown;
}
export declare function createBringApiError(message: string, options?: ErrorOptions): BringApiError;
export declare function isBringApiError(error: unknown): error is BringApiError;
export {};
//# sourceMappingURL=errors.d.ts.map