const { getProviders } = require('./providers');

function isScopeProp(property) {
  return property.key.name === 'scope';
}

module.exports = function getDirectiveSource(optionsNode, bootstrap) {
  const providers = getProviders();
  const scope = optionsNode.expression.properties.find(isScopeProp).value.value;
  const scopeDefinition = bootstrap[scope];

  if (!scopeDefinition) {
    throw new Error(`State scope "${scope}" is not defined.`);
  }

  if (!providers[scopeDefinition.type]) {
    throw new Error(
      `There is no registered provider for scope of type "${
        scopeDefinition.type
      }"`,
    );
  }

  return providers[scopeDefinition.type];
};
