/* global require */
/* eslint-disable import/extensions */

/**
 * Verifies package export conditions for the barrel, CLI, and representative subpaths.
 */
test('the CJS barrel does not export CLI', () => {
    const expensifyCommon = require('../dist/index.js');
    expect(expensifyCommon.CLI).toBeUndefined();
    expect(expensifyCommon.Str).toBeDefined();
    expect(expensifyCommon.unescapeText).toBeDefined();
});

test('the CJS barrel resolves through package exports', () => {
    const expensifyCommon = require('expensify-common');
    expect(expensifyCommon.Str).toBeDefined();
    expect(expensifyCommon.unescapeText).toBeDefined();
    expect(expensifyCommon.Device.getOSAndName).toEqual(expect.any(Function));
});

test('CLI subpath resolves to compiled dist output', () => {
    expect(require.resolve('expensify-common/CLI')).toMatch(/dist\/CLI\.js$/);
});

test('CLI subpath ESM entry is published alongside the CJS build', () => {
    const fs = require('fs');

    expect(fs.existsSync(require.resolve('../dist/esm/CLI.js'))).toBe(true);
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

test('Device subpath resolves through package exports', () => {
    const {getOSAndName} = require('expensify-common/Device');

    expect(typeof getOSAndName).toBe('function');
});

test('utils subpath resolves through package exports', () => {
    const {unescapeText} = require('expensify-common/utils');

    expect(unescapeText('&amp;')).toBe('&');
});

test('Device and utils subpaths support ESM import', async () => {
    const {getOSAndName} = await import('expensify-common/Device');
    const {unescapeText} = await import('expensify-common/utils');

    expect(typeof getOSAndName).toBe('function');
    expect(unescapeText('&amp;')).toBe('&');
});

test('barrel supports ESM import through package exports', async () => {
    const {Str, unescapeText, Device} = await import('expensify-common');

    expect(Str).toBeDefined();
    expect(unescapeText('&amp;')).toBe('&');
    expect(typeof Device.getOSAndName).toBe('function');
});

test('nested component subpaths resolve through package exports', () => {
    const CopyText = require('expensify-common/components/CopyText');

    expect(CopyText.default).toBeDefined();
});

test('every compiled CJS entry is exported as a canonical subpath', () => {
    const fs = require('fs');
    const path = require('path');
    const packageJson = require('../package.json');

    function collectCjsEntryPaths(directory, relativePath = '') {
        const entries = [];

        for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
            if (entry.name === 'esm') {
                continue;
            }

            const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                entries.push(...collectCjsEntryPaths(path.join(directory, entry.name), entryRelativePath));
                continue;
            }

            if (!entry.name.endsWith('.js') || entry.name === 'cli.esm.js') {
                continue;
            }

            entries.push(entryRelativePath.replace(/\.js$/, ''));
        }

        return entries;
    }

    const distDir = path.join(require.resolve('../dist/index.js'), '..');
    const entryPaths = collectCjsEntryPaths(distDir);

    for (const entryPath of entryPaths) {
        if (entryPath === 'index') {
            continue;
        }

        expect(packageJson.exports[`./${entryPath}`]).toBeDefined();
        expect(packageJson.exports[`./dist/${entryPath}`]).toBeUndefined();
    }
});
