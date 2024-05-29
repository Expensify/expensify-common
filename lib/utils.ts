/** Checks if the `window` global object is available. */
function isWindowAvailable(): boolean {
    return typeof window !== 'undefined';
}

/** Checks if the `navigator` global object is available. */
function isNavigatorAvailable(): boolean {
    return typeof navigator !== 'undefined';
}

export {isWindowAvailable, isNavigatorAvailable};
