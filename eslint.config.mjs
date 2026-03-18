import {defineConfig, globalIgnores} from 'eslint/config';
import {fixupConfigRules, fixupPluginRules} from '@eslint/compat';
import {FlatCompat} from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import expensifyConfig from 'eslint-config-expensify';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

// Plugins already registered by the expensify base config
const EXPENSIFY_PLUGINS = new Set(['import', 'react', 'react-hooks', 'jsx-a11y', '@lwc/lwc', 'es', 'rulesdir', 'jsdoc', 'unicorn']);

// Remove only plugins already registered by expensify config to avoid "Cannot redefine plugin" errors.
function stripConflictingPlugins(configs) {
    return configs.map((config) => {
        if (!config.plugins) return config;
        const filtered = Object.fromEntries(Object.entries(config.plugins).filter(([name]) => !EXPENSIFY_PLUGINS.has(name)));
        return {...config, plugins: filtered};
    });
}

export default defineConfig([
    // Expensify base config (already flat config format, registers import/react/etc. plugins)
    ...expensifyConfig,

    // Prettier config (legacy, needs compat)
    ...compat.extends('prettier'),

    // Global settings
    {
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.jest,
            },
        },
    },

    // JS/JSX files
    {
        files: ['**/*.js', '**/*.jsx'],

        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },

        rules: {
            'react/jsx-filename-extension': 'off',
            'rulesdir/no-api-in-views': 'off',
            'rulesdir/no-multiple-api-calls': 'off',
            'rulesdir/prefer-import-module-contents': 'off',
            'no-constructor-return': 'off',
            'max-classes-per-file': 'off',
            'arrow-body-style': 'off',
            'es/no-nullish-coalescing-operators': 'off',
            'rulesdir/prefer-underscore-method': 'off',
            'es/no-optional-chaining': 'off',

            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
        },
    },

    // TS/TSX files
    {
        files: ['**/*.ts', '**/*.tsx'],

        extends: [
            ...stripConflictingPlugins(
                fixupConfigRules(
                    compat.extends(
                        'plugin:@typescript-eslint/recommended',
                        'plugin:@typescript-eslint/stylistic',
                        'plugin:import/typescript',
                        'plugin:you-dont-need-lodash-underscore/all',
                        'prettier',
                        'plugin:prettier/recommended',
                    ),
                ),
            ),
        ],

        plugins: {
            '@typescript-eslint': fixupPluginRules(typescriptEslint),
        },

        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },

        rules: {
            'prefer-regex-literals': 'off',
            'rulesdir/prefer-underscore-method': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/require-default-props': 'off',
            'valid-jsdoc': 'off',
            'es/no-optional-chaining': 'off',
            'es/no-nullish-coalescing-operators': 'off',

            'react/jsx-filename-extension': [
                'error',
                {
                    extensions: ['.tsx', '.jsx'],
                },
            ],

            'import/no-unresolved': 'error',
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],

            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                },
            ],

            '@typescript-eslint/consistent-type-exports': [
                'error',
                {
                    fixMixedExportsWithInlineTypeSpecifier: false,
                },
            ],

            '@typescript-eslint/no-non-null-assertion': 'off',

            '@typescript-eslint/array-type': [
                'error',
                {
                    default: 'array-simple',
                },
            ],

            '@typescript-eslint/consistent-type-definitions': 'off',

            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                },
            ],
        },
    },

    globalIgnores(['**/*.d.ts', '**/dist', '**/node_modules', '**/*.config.js', '**/*.config.mjs']),
]);
