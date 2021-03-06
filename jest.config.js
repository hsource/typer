module.exports = {
  preset: 'react-native',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@delta/(.*)$': '<rootDir>/src/delta/$1',
    '^@model/(.*)$': '<rootDir>/src/model/$1',
    '^@test/(.*)$': '<rootDir>/src/test/$1',
  },
  modulePathIgnorePatterns: ['npm-cache', '.npm', 'examples', 'lib'],
  transformIgnorePatterns: ['node_modules/?!(ramda)'],
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: '.jest/cache',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'clover'],
}
