module.exports = {
  launch: {
    flags: ["–no-sandbox", "–disable-setuid-sandbox"]
  },
  globals: {
     'ts-jest': {
       diagnostics: false
     }
  },
  preset: 'jest-puppeteer',
  testRegex: 'test/.*.*(\\.)test\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
};
