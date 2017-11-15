function isScopeProp(property) {
  return property.key.name === 'scope';
}

module.exports = function getDirectiveSource(optionsNode, bootstrap) {
  const scope = optionsNode.expression.properties.find(isScopeProp).value.value;
  const scopeDefinition = bootstrap[scope];

  if (!scopeDefinition) {
    throw new Error(`State scope "${scope}" is not defined.`);
  }

  switch (scopeDefinition.type) {
    case 'session':
      return './src/runtimes/session';
    default:
      throw new Error(`Unexpected use of unknown scope type "${scopeDefinition.type}"`);
  }
};
