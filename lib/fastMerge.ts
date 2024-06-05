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
 * Merges the source object into the target object.
 * @param target - The target object.
 * @param source - The source object.
 * @param shouldRemoveNestedNulls - If true, null object values will be removed.
 * @returns - The merged object.
 */
function mergeObject<TObject extends Record<string, unknown>>(target: TObject, source: TObject, shouldRemoveNullObjectValues = true): TObject {
    const destination: Record<string, unknown> = {};

    if (isMergeableObject(target)) {
        // lodash adds a small overhead so we don't use it here
        const targetKeys = Object.keys(target);
        for (let i = 0; i < targetKeys.length; ++i) {
            const key = targetKeys[i];
            const sourceValue = source?.[key];
            const targetValue = target?.[key];

            // If shouldRemoveNullObjectValues is true, we want to remove null values from the merged object
            const isSourceOrTargetNull = targetValue === null || sourceValue === null;
            const shouldOmitSourceKey = shouldRemoveNullObjectValues && isSourceOrTargetNull;

            if (!shouldOmitSourceKey) {
                destination[key] = targetValue;
            }
        }
    }

    // lodash adds a small overhead so we don't use it here
    const sourceKeys = Object.keys(source);
    for (let i = 0; i < sourceKeys.length; ++i) {
        const key = sourceKeys[i];
        const sourceValue = source?.[key];
        const targetValue = target?.[key];

        // If shouldRemoveNullObjectValues is true, we want to remove null values from the merged object
        const shouldOmitSourceKey = shouldRemoveNullObjectValues && sourceValue === null;

        // If we pass undefined as the updated value for a key, we want to generally ignore it
        const isSourceKeyUndefined = sourceValue === undefined;

        if (!isSourceKeyUndefined && !shouldOmitSourceKey) {
            const isSourceKeyMergable = isMergeableObject(sourceValue);

            if (isSourceKeyMergable && targetValue) {
                if (!shouldRemoveNullObjectValues || isSourceKeyMergable) {
                    // eslint-disable-next-line no-use-before-define
                    destination[key] = fastMerge(targetValue as TObject, sourceValue, shouldRemoveNullObjectValues);
                }
            } else if (!shouldRemoveNullObjectValues || sourceValue !== null) {
                destination[key] = sourceValue;
            }
        }
    }

    return destination as TObject;
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
    // otherwise "mergeObject" will throw an error,
    // because it expects an object as "source"
    if (Array.isArray(source) || source === null || source === undefined) {
        return source;
    }
    return mergeObject(target as Record<string, unknown>, source as Record<string, unknown>, shouldRemoveNullObjectValues) as TObject;
}

export default fastMerge;
