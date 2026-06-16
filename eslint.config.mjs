import {FlatCompat} from '@eslint/eslintrc';
import babelParser from '@babel/eslint-parser';
import browserConfig from 'eslint-config-expensify/browser';
import reactConfig from 'eslint-config-expensify/react';
import tsExpensifyConfig from 'eslint-config-expensify/typescript';
import jestConfig from 'eslint-config-expensify/jest';
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
    ...jestConfig,
    {
        files: ['lib/components/**/*.{js,jsx}'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
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
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
    },
    ...compat.extends('plugin:import/typescript').map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
    })),
]);
