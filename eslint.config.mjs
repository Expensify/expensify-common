import {FlatCompat} from '@eslint/eslintrc';
import babelParser from '@babel/eslint-parser';
import browserConfig from 'eslint-config-expensify/browser';
import reactConfig from 'eslint-config-expensify/react';
import tsExpensifyConfig from 'eslint-config-expensify/typescript';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default defineConfig([
    globalIgnores(['**/*.d.ts', 'dist', 'node_modules', '**/*.config.js']),
    ...browserConfig,
    ...reactConfig,
    ...tsExpensifyConfig,
    ...compat.extends('prettier'),
    {
        languageOptions: {
            globals: globals.jest,
        },
        rules: {
            'class-methods-use-this': 'off',
            'no-console': ['error', {allow: ['debug', 'error']}],
        },
    },
    {
        files: ['lib/components/**/*.{js,jsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                },
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.jquery,
            },
        },
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            globals: {
                ...globals.jquery,
            },
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
        rules: {
            // Allow JSX to be written in any file ignoring the extension type
            'react/jsx-filename-extension': 'off',
            'no-constructor-return': 'off',
            'max-classes-per-file': 'off',
            'arrow-body-style': 'off',
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
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
        },
    },
    ...compat.extends('plugin:import/typescript', 'plugin:you-dont-need-lodash-underscore/all', 'prettier', 'plugin:prettier/recommended').map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
    })),
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            'prefer-regex-literals': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/require-default-props': 'off',
            'react/jsx-filename-extension': ['error', {extensions: ['.tsx', '.jsx']}],
            'import/no-unresolved': 'error',
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
            '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
            '@typescript-eslint/consistent-type-exports': ['error', {fixMixedExportsWithInlineTypeSpecifier: false}],
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
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
]);
