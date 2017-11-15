const getDirectiveSource = require('../../config/getDirectiveSource');

function createNode(properties) {
  return ({
    expression: {
      properties,
    },
  });
}

function createProperty(name, value) {
  return {
    key: { name },
    value: { value },
  };
}

describe('getDirectiveSource', () => {
  it('throws when a undefined scope is being used', () => {
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    expect(() => {
      getDirectiveSource(fakeNode, { bar: {} });
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws when a undefined scope type is being used', () => {
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    expect(() => {
      getDirectiveSource(fakeNode, { foo: { type: 'bar' } });
    }).toThrowErrorMatchingSnapshot();
  });

  it('supports a session scope type', () => {
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    const source = getDirectiveSource(fakeNode, { foo: { type: 'session' } });

    expect(source).toBe('./src/runtimes/session');
  });
});
