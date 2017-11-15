const transformStateOptions = require('./transformStateOptions');
const getDirectiveSource = require('./getDirectiveSource');

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
