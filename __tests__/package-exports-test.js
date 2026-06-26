/* global require */
/* eslint-disable import/extensions */
/**
 * Verifies that CLI is not exported from the compiled barrel.
 */
test('the CJS barrel does not export CLI', () => {
    const expensifyCommon = require('../dist/index.js');
    expect(expensifyCommon.CLI).toBeUndefined();
    expect(expensifyCommon.Str).toBeDefined();
});

test('CLI subpath resolves to compiled dist output', () => {
    expect(require.resolve('expensify-common/CLI')).toMatch(/dist\/CLI\.js$/);
});

test('CLI subpath ESM entry is published alongside the CJS build', () => {
    const fs = require('fs');
    const path = require('path');

    expect(fs.existsSync(path.join(__dirname, '../dist/esm/CLI.js'))).toBe(true);
});

test('CLI subpath default export is the constructor via require', () => {
    const CLI = require('expensify-common/CLI');
    const CLIClass = CLI.default || CLI;
    expect(typeof CLIClass).toBe('function');
    expect(CLIClass.name).toBe('CLI');
});

test('CLI subpath default export is the constructor via ESM import', async () => {
    const {default: CLI} = await import('expensify-common/CLI');
    expect(typeof CLI).toBe('function');
    expect(CLI.name).toBe('CLI');
});
