const transformStateOptions = require('../src/transformStateOptions');
const babel = require('babel-core');
const errorMatchingSnapshot = require('./helpers/errorMatchingSnapshot');

function transform(input) {
  const sourceString = `<div options="${input}" />`;

  const code = babel.transform(
    sourceString,
    {
      filename: 'test.js',
      babelrc: false,
      plugins: [
        'syntax-jsx',
        () => ({
          visitor: {
            JSXAttribute(path) {
              const value = path.get('value');

              try {
                value.replaceWith(transformStateOptions(babel, value.node));
              } catch (e) {
                throw value.hub.file.buildCodeFrameError(value.node, e.message);
              }
            },
          },
        }),
      ],
    },
  ).code;

  return code;
}

describe('transformStateOptions', () => {
  it('transforms a simple state getter', () => {
    expect(transform('foo')).toMatchSnapshot();
  });

  it('transforms a state getter with name mapping', () => {
    expect(transform('foo:bar')).toMatchSnapshot();
  });

  it('throws a syntax error when multiple name mappings are used', () => {
    expect(() => {
      transform('foo:bar:baz');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms a state getter with scope', () => {
    expect(transform('foo/bar')).toMatchSnapshot();
  });

  it('throws a syntax error when scope is deeper than 1', () => {
    expect(() => {
      transform('foo/bar/baz');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms a state getter with scope and name mapping', () => {
    expect(transform('aww:foo/bar')).toMatchSnapshot();
  });

  it('throws a correct code frame when scope is deeper than 1 with name mapping', () => {
    expect(() => {
      transform('drrt:foo/bar/baz');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms a state setter', () => {
    expect(transform('toggle(foo)')).toMatchSnapshot();
  });

  it('throws a syntax error when setters are nested', () => {
    expect(() => {
      transform('foo(bar())');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws a syntax error setter is not closed', () => {
    expect(() => {
      transform('foo(bar');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws a syntax error setter is not end of statement', () => {
    expect(() => {
      transform('foo(bar)lol');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms a state setter with name mapping and scope', () => {
    expect(transform('onClick:toggle(foo/bar)')).toMatchSnapshot();
  });

  it('throws a correct code frame when scope is deeper than 1 with name mapping setter', () => {
    expect(() => {
      transform('drrt:brr(foo/bar/baz)');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms two state declarations', () => {
    expect(transform('value:name;onChange:set(name)')).toMatchSnapshot();
  });

  it('throws a correct code frame for second state getter', () => {
    expect(() => {
      transform('value:name;other:value:name');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws error when keys are used twice', () => {
    expect(() => {
      transform('foo;foo');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws error when keys are used twice via name mapping', () => {
    expect(() => {
      transform('set(name);set:foo');
    }).toThrow(errorMatchingSnapshot());
  });
});
