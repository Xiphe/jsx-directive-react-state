const transformStateOptions = require('./src/transformStateOptions');

module.exports = [
  {
    name: 'html',
    type: 'element',
    source: './src/StateProviderDirective',
  },
  {
    name: 'state',
    source: './src/ConnectDirective',
    transformOptions: transformStateOptions,
  },
];
