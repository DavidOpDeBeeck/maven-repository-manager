export function assertDefined(obj: any, message?: string): void {
    if (obj === undefined || obj === null) {
        throw new Error(message);
    }
}

export function mapIfPresent<T, R>(obj: T, mapping: (obj: T) => R): R | undefined {
    return obj ? mapping(obj) : undefined;
}