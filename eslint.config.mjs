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
            'no-constructor-return': 'off',
            'max-classes-per-file': 'off',
            'arrow-body-style': 'off',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
        },
    },
    ...compat.extends('plugin:import/typescript', 'prettier', 'plugin:prettier/recommended').map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
    })),
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            'prefer-regex-literals': 'off',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
        },
    },
]);
