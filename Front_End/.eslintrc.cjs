module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // The project doesn't use PropTypes.
    'react/prop-types': 'off',
    // `import React` is still used by a few files; rest-siblings are an intentional way to omit fields.
    'no-unused-vars': ['error', { varsIgnorePattern: '^React$', ignoreRestSiblings: true }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', 'src/test/**'],
      env: { node: true },
      globals: { describe: 'readonly', it: 'readonly', expect: 'readonly', beforeEach: 'readonly', afterEach: 'readonly', vi: 'readonly' },
    },
  ],
}
