module.exports = {
    extends: ['expensify', 'prettier'],
    rules: {
        // Allow JSX to be written in any file ignoring the extension type
        'react/jsx-filename-extension': 'off'
    },
    plugins: ['jest'],
    env: {
        "jest/globals": true
    }
};
