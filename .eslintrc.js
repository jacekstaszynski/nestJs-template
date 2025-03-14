module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'node_modules'],
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      trailingComma: 'all',
      semi: true,
      tabWidth: 2,
      printWidth: 100,
      bracketSpacing: true,
      arrowParens: 'avoid',
      endOfLine: 'lf'
    }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
   "overrides": [
    {
      "files": ["*.spec.ts", "*.test.ts", "test/**/*.ts"],
      // Your test-specific ESLint rules here
    }
  ]
};
