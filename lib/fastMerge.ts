'worklet';

/* eslint-disable @typescript-eslint/prefer-for-of */

// Mostly copied from https://medium.com/@lubaka.a/how-to-remove-lodash-performance-improvement-b306669ad0e1

/**
 * Checks whether the given value can be merged. It has to be an object, but not an array, RegExp or Date.
 */
function isMergeableObject(value: unknown): value is Record<string, unknown> {
    const nonNullObject = value != null ? typeof value === 'object' : false;
    return nonNullObject && Object.prototype.toString.call(value) !== '[object RegExp]' && Object.prototype.toString.call(value) !== '[object Date]' && !Array.isArray(value);
}

/**
 * Merges two objects and removes null values if "shouldRemoveNullObjectValues" is set to true
 *
 * We generally want to remove null values from objects written to disk and cache, because it decreases the amount of data stored in memory and on disk.
 * On native, when merging an existing value with new changes, SQLite will use JSON_PATCH, which removes top-level nullish values.
 * To be consistent with the behaviour for merge, we'll also want to remove null values for "set" operations.
 */
function fastMerge<TObject>(target: TObject, source: TObject, shouldRemoveNullObjectValues = true): TObject {
    // We have to ignore arrays and nullish values here,
    // otherwise merging will throw an error,
    // because it expects an object as "source"
    if (Array.isArray(source) || source === null || source === undefined) {
        return source;
    }

    // If source is not an object, return it as-is
    if (!isMergeableObject(source)) {
        return source;
    }

    const destination: Record<string, unknown> = {};

    // Process target object properties first
    if (isMergeableObject(target)) {
        const targetKeys = Object.keys(target as Record<string, unknown>);
        for (let i = 0; i < targetKeys.length; ++i) {
            const key = targetKeys[i];
            const sourceValue = (source as Record<string, unknown>)?.[key];
            const targetValue = (target as Record<string, unknown>)?.[key];

            // If shouldRemoveNullObjectValues is true, we want to remove null values from the merged object
            const isSourceOrTargetNull = targetValue === null || sourceValue === null;
            const shouldOmitSourceKey = shouldRemoveNullObjectValues && isSourceOrTargetNull;

            if (!shouldOmitSourceKey) {
                destination[key] = targetValue;
            }
        }
    }

    // Process source object properties
    const sourceKeys = Object.keys(source as Record<string, unknown>);
    for (let i = 0; i < sourceKeys.length; ++i) {
        const key = sourceKeys[i];
        const sourceValue = (source as Record<string, unknown>)?.[key];
        const targetValue = (target as Record<string, unknown>)?.[key];

        // If shouldRemoveNullObjectValues is true, we want to remove null values from the merged object
        const shouldOmitSourceKey = shouldRemoveNullObjectValues && sourceValue === null;

        // If we pass undefined as the updated value for a key, we want to generally ignore it
        const isSourceKeyUndefined = sourceValue === undefined;

        if (!isSourceKeyUndefined && !shouldOmitSourceKey) {
            const isSourceKeyMergable = isMergeableObject(sourceValue);

            if (isSourceKeyMergable && targetValue) {
                if (!shouldRemoveNullObjectValues || isSourceKeyMergable) {
                    // Recursive call - since we're within the same function, this works
                    destination[key] = fastMerge(targetValue, sourceValue, shouldRemoveNullObjectValues);
                }
            } else if (!shouldRemoveNullObjectValues || sourceValue !== null) {
                destination[key] = sourceValue;
            }
        }
    }

    return destination as TObject;
}

export default fastMerge;
