/* global require */
/* eslint-disable import/extensions */
/**
 * Verifies that CLI is not exported from the compiled barrel.
 */
test("the CJS barrel does not export CLI", () => {
  const expensifyCommon = require("../dist/index.js");
  expect(expensifyCommon.CLI).toBeUndefined();
  expect(expensifyCommon.Str).toBeDefined();
});

test("CLI is available from the source subpath export", () => {
  expect(require.resolve("expensify-common/CLI")).toMatch(/lib\/CLI\.ts$/);
});
