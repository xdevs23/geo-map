module.exports = {
  // testEnvironment: "node",
  globals: {
     'ts-jest': {
       diagnostics: false
     }
  },
  preset: 'ts-jest',
  testPathIgnorePatterns: ["/node_modules/", "./test", "./dist"]
};
