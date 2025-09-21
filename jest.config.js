// Jest configuration using Next.js preset and JS file to avoid ts-node requirement
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Use the project directory explicitly to avoid workspace root warnings
  dir: __dirname,
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

module.exports = createJestConfig(customJestConfig);
