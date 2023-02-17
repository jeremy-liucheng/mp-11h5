module.exports = {
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'none',
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    }
  ],
  arrowParens: 'avoid'
};
