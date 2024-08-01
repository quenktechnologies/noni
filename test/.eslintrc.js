module.exports = {
    extends: ['../src/.eslintrc.js'],
    ignorePatterns: ['.eslintrc.js', 'register.js', 'test/browser/**/*'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './test/tsconfig.json'
    }
};
