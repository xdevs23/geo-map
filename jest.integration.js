const ts = require('ts-jest');
const puppeteer = require('jest-puppeteer/jest-preset');

module.exports = {
  ...ts.jestPreset,
  ...puppeteer,
  testMatch: ['<rootDir>/test/*.test.ts']
};
