function getAs(declaration, start, offset) {
  const tokens = declaration.split(':');

  if (tokens.length > 2) {
    // eslint-disable-next-line no-param-reassign
    start.column += tokens.slice(0, 2).join(':').length + 1 + offset;
    throw new Error('Unexpected token :');
  }

  if (tokens.length === 2) {
    return {
      offset: offset + tokens[0].length + 1,
      as: tokens[0],
      declaration: tokens[1],
    };
  }

  return { declaration, offset };
}

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

function transformOption(t, value, start, offset, usedKeys) {
  const asResult = getAs(value, start, offset);
  const properties = [];

  if (asResult.as) {
    properties.push(t.objectProperty(
      t.identifier('as'),
      t.stringLiteral(asResult.as),
    ));
  }

  const setterResult = getSetter(asResult.declaration, start, asResult.offset);

  if (setterResult.setter) {
    properties.push(t.objectProperty(
      t.identifier('setter'),
      t.stringLiteral(setterResult.setter),
    ));
  }

  const scopeResult = getScope(setterResult.declaration, start, setterResult.offset);

  if (scopeResult.scope) {
    properties.push(t.objectProperty(
      t.identifier('scope'),
      t.stringLiteral(scopeResult.scope),
    ));
  }

  properties.push(t.objectProperty(
    t.identifier('key'),
    t.stringLiteral(scopeResult.declaration),
  ));

  const internalName = setterResult.setter ? setterResult.setter : scopeResult.declaration;
  const name = asResult.as || internalName;
  if (usedKeys.indexOf(name) !== -1) {
    // eslint-disable-next-line no-param-reassign
    start.column += offset + 1;
    throw new Error(`Key '${name}' has already been declared`);
  }

  usedKeys.push(name);
  return t.objectExpression(properties);
}

module.exports = function transformStateOptions({ types: t }, node) {
  if (!t.isStringLiteral(node)) {
    return node;
  }

  let offset = 0;
  const usedKeys = [];

  const declarations = node.value.split(';').map((declaration) => {
    const transformedDeclaration = transformOption(
      t,
      declaration,
      node.loc.start,
      offset,
      usedKeys,
    );

    offset += declaration.length + 1;

    return transformedDeclaration;
  });

  return t.jSXExpressionContainer(
    t.arrayExpression(declarations),
  );
};
