const path = require('path');
const transformStateOptions = require('./transformStateOptions');
const getDirectiveSource = require('./getDirectiveSource');
const { registerProvider } = require('./providers');

registerProvider(
  'session',
  path.resolve(__dirname, '../src/stateProviders/session'),
);

module.exports = [
  {
    name: 'html',
    type: 'element',
    bootstrap: null,
    source: './src/StateProviderDirective',
  },
  {
    name: 'state',
    source: getDirectiveSource,
    transformOptions: transformStateOptions,
  },
];

module.exports.register = registerProvider;
