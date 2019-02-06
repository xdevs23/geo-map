module.exports = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    resources: 'usable',
    runScripts: 'dangerously'
  },
  preset: "ts-jest",
  testMatch: ["<rootDir>/src/**/*.test.ts"]
};
