export function createBringApiError(message, options = {}) {
    const error = new Error(message, { cause: options.cause });
    Object.defineProperties(error, {
        name: { value: 'BringApiError', enumerable: true },
        status: { value: options.status, enumerable: true },
        code: { value: options.code, enumerable: true },
        apiCode: { value: options.apiCode, enumerable: true },
        body: { value: options.body, enumerable: false }
    });
    return error;
}
export function isBringApiError(error) {
    return error instanceof Error && error.name === 'BringApiError';
}
//# sourceMappingURL=errors.js.map