import expensifyConfig from 'eslint-config-expensify';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import _import from 'eslint-plugin-import';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...expensifyConfig,
    prettierConfig,
    {
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.jest,
            },
        },
    },
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
            // Allow JSX to be written in any file ignoring the extension type
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
    ...fixupConfigRules(
        compat.extends(
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/stylistic',
            'plugin:import/typescript',
            'plugin:you-dont-need-lodash-underscore/all',
            'plugin:prettier/recommended'
        )
    ),
    {
        files: ['**/*.ts', '**/*.tsx'],
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
            'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
            'import/no-unresolved': 'error',
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
            '@typescript-eslint/consistent-type-exports': [
                'error',
                { fixMixedExportsWithInlineTypeSpecifier: false },
            ],
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
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
    {
        ignores: ['**/*.d.ts', '**/dist', '**/node_modules', '**/*.config.js'],
    },
];
