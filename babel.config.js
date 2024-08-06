module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    'module:@react-native/babel-preset',
  ],
  plugins: [
    // '@realm/babel-plugin',
    // ['@babel/plugin-proposal-decorators', {legacy: true}],
  ],
};
