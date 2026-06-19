/**
 * Unwraps nested default exports produced when ESM imports a CJS module compiled by TypeScript.
 */
export function interopDefault(module) {
  const value = module?.default ?? module;
  return value?.default ?? value;
}
