function getScope(declaration, start, offset) {
  const tokens = declaration.split('/');

  if (tokens.length > 2) {
    // eslint-disable-next-line no-param-reassign
    start.column += tokens.slice(0, 2).join('/').length + 1 + offset;
    throw new Error('Unexpected token /');
  }

  if (tokens.length === 2) {
    return {
      offset: offset + tokens[0].length + 1,
      scope: tokens[0],
      declaration: tokens[1],
    };
  }

  return { declaration, offset };
}

function getSetter(declaration, start, offset) {
  const tokens = declaration.split('(');

  if (tokens.length > 2) {
    // eslint-disable-next-line no-param-reassign
    start.column += tokens.slice(0, 2).join('(').length + 1 + offset;
    throw new Error('Unexpected token (');
  }

  if (tokens.length === 2) {
    const closingTokens = tokens[1].split(')');

    if (closingTokens.length === 1) {
      // eslint-disable-next-line no-param-reassign
      start.column += declaration.length + 1;
      throw new Error('Unexpected end of input');
    }

    if (closingTokens[1].length) {
      // eslint-disable-next-line no-param-reassign
      start.column += tokens[0].length + 1 + closingTokens[0].length + 2;
      throw new Error('Expected end of input');
    }

    return {
      offset: offset + tokens[0].length + 1,
      setter: tokens[0],
      declaration: closingTokens[0],
    };
  }

  return { declaration, offset };
}

function transformOption(t, value, start) {
  const properties = [];

  const setterResult = getSetter(value, start, 0);

  if (setterResult.setter) {
    properties.push(
      t.objectProperty(
        t.identifier('setter'),
        t.stringLiteral(setterResult.setter),
      ),
    );
  }

  const scopeResult = getScope(
    setterResult.declaration,
    start,
    setterResult.offset,
  );

  if (scopeResult.scope) {
    properties.push(
      t.objectProperty(
        t.identifier('scope'),
        t.stringLiteral(scopeResult.scope),
      ),
    );
  }

  properties.push(
    t.objectProperty(
      t.identifier('key'),
      t.stringLiteral(scopeResult.declaration),
    ),
  );

  return t.objectExpression(properties);
}

module.exports = function transformStateOptions({ types: t }, node) {
  if (!t.isStringLiteral(node)) {
    return node;
  }

  const semiPos = node.value.indexOf(';');
  if (semiPos >= 0) {
    // eslint-disable-next-line no-param-reassign
    node.loc.start.column += semiPos + 1;
    throw new Error('Unexpected token ;');
  }

  const colonPos = node.value.indexOf(':');
  if (colonPos >= 0) {
    // eslint-disable-next-line no-param-reassign
    node.loc.start.column += colonPos + 1;
    throw new Error('Unexpected token :');
  }

  const declaration = transformOption(t, node.value, node.loc.start);

  return t.jSXExpressionContainer(declaration);
};
