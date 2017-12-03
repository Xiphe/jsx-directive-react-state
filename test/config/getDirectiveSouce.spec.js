const getDirectiveSource = require('../../config/getDirectiveSource');
const { registerProvider, __reset } = require('../../config/providers');

function createNode(properties) {
  return {
    expression: {
      properties,
    },
  };
}

function createProperty(name, value) {
  return {
    key: { name },
    value: { value },
  };
}

describe('getDirectiveSource', () => {
  afterEach(() => {
    __reset();
  });

  it('throws when a undefined scope is being used', () => {
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    expect(() => {
      getDirectiveSource(fakeNode, {});
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws when a undefined scope type is being used', () => {
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    expect(() => {
      getDirectiveSource(fakeNode, { foo: { type: 'bar' } });
    }).toThrowErrorMatchingSnapshot();
  });

  it('supports a registered scope type', () => {
    registerProvider('bar', '/bar.js');
    const fakeNode = createNode([createProperty('scope', 'foo')]);

    const source = getDirectiveSource(fakeNode, { foo: { type: 'bar' } });

    expect(source).toBe('/bar.js');
  });
});
