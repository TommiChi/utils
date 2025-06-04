module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // roots: ['<rootDir>/src'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov'],
};
