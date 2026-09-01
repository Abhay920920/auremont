module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/security/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>'],
  rootDir: '.',
  modulePaths: ['<rootDir>/../auremont-backend/node_modules'],
  moduleDirectories: ['node_modules', '../auremont-backend/node_modules'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.security.json',
    },
  },
};
