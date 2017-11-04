const transformStateOptions = require('../src/transformStateOptions');
const babel = require('babel-core');
const errorMatchingSnapshot = require('./helpers/errorMatchingSnapshot');

function transform(input) {
  const sourceString = `<div options=${input} />`;

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
  it('does not transform objects', () => {
    expect(transform('{{ foo: "bar" }}')).toMatchSnapshot();
  });

  it('transforms a simple state getter', () => {
    expect(transform('"foo"')).toMatchSnapshot();
  });

  it('transforms a state getter with scope', () => {
    expect(transform('"foo/bar"')).toMatchSnapshot();
  });

  it('throws a syntax error when scope is deeper than 1', () => {
    expect(() => {
      transform('"foo/bar/baz"');
    }).toThrow(errorMatchingSnapshot());
  });

  it('transforms a state setter', () => {
    expect(transform('"toggle(foo)"')).toMatchSnapshot();
  });

  it('throws a syntax error when setters are nested', () => {
    expect(() => {
      transform('"foo(bar())"');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws a syntax error setter is not closed', () => {
    expect(() => {
      transform('"foo(bar"');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws a syntax error setter is not end of statement', () => {
    expect(() => {
      transform('"foo(bar)lol"');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws when a semicolon is being used', () => {
    expect(() => {
      transform('"bar;foo(bar)"');
    }).toThrow(errorMatchingSnapshot());
  });

  it('throws when a colon is being used', () => {
    expect(() => {
      transform('"bar:foo(bar)"');
    }).toThrow(errorMatchingSnapshot());
  });
});
