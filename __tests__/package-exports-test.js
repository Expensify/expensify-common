/* global require */
/* eslint-disable import/extensions */
/**
 * Verifies that requiring the CJS barrel does not eagerly load CLI (and therefore readline).
 */
test("importing Str from the CJS barrel does not load CLI", () => {
  jest.isolateModules(() => {
    let cliLoaded = false;
    const cliPath = require.resolve("../dist/CLI.js");

    jest.doMock(cliPath, () => {
      cliLoaded = true;
      return jest.requireActual(cliPath);
    });

    const expensifyCommon = require("../dist/index.js");
    expensifyCommon.Str.dedent("  hello");
    expect(cliLoaded).toBe(false);

    // Accessing an instance method should load the real CLI module.
    expect(typeof expensifyCommon.CLI.prototype.promptUserConfirmation).toBe(
      "function",
    );
    expect(cliLoaded).toBe(true);
  });
});

test("ESM named import of Str works via the package exports map", async () => {
  const { Str } = await import("expensify-common");
  expect(Str.dedent("  hello")).toBe("hello");
});
