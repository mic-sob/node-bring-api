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

export function createBringApiError(message: string, options: ErrorOptions = {}): BringApiError {
    const error = new Error(message, { cause: options.cause }) as BringApiError;

    Object.defineProperties(error, {
        name: { value: 'BringApiError', enumerable: true },
        status: { value: options.status, enumerable: true },
        code: { value: options.code, enumerable: true },
        apiCode: { value: options.apiCode, enumerable: true },
        body: { value: options.body, enumerable: false }
    });

    return error;
}

export function isBringApiError(error: unknown): error is BringApiError {
    return error instanceof Error && error.name === 'BringApiError';
}
