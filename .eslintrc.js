module.exports = {
    extends: ['expensify', 'prettier'],
    parser: '@typescript-eslint/parser',
    overrides: [
        {
            files: ['*.js', '*.jsx'],
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
            files: ['*.ts', '*.tsx'],
            extends: ['expensify', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/stylistic', 'plugin:import/typescript', 'prettier', 'plugin:prettier/recommended'],
            plugins: ['react', 'import', '@typescript-eslint'],
            parserOptions: {
                project: './tsconfig.json',
            },
            rules: {
                'prefer-regex-literals': 'off',
                'rulesdir/prefer-underscore-method': 'off',
                'react/jsx-props-no-spreading': 'off',
                'react/require-default-props': 'off',
                'valid-jsdoc': 'off',
                'es/no-optional-chaining': 'off',
                'es/no-nullish-coalescing': 'off',
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
            },
        },
    ],
};
