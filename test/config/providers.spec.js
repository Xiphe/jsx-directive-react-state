/* eslint-disable camelcase */
const {
  registerProvider,
  __reset,
  getProviders,
} = require('../../config/providers');

describe('providers', () => {
  afterEach(() => {
    __reset();
  });

  it('has no registered providers by default', () => {
    expect(getProviders()).toEqual({});
  });

  it('provides registered providers', () => {
    registerProvider('foo', 'bar');

    expect(getProviders()).toEqual({ foo: 'bar' });
  });

  it('does not support overwrites of providers', () => {
    registerProvider('foo', 'bar');
    expect(() => {
      registerProvider('foo', 'bar');
    }).toThrowErrorMatchingSnapshot();
  });
});
