module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts)$'],
  watchPlugins: [],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}
