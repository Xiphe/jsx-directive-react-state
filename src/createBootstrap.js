import { registerProvider } from './StateProviderDirective';

export default function createBootstrap(providerKey, bootstrapFn, Provider) {
  return options => {
    const typeOptions = Object.keys(options).reduce((memo, key) => {
      const definition = options[key];

      if (definition.type === providerKey) {
        // eslint-disable-next-line no-param-reassign
        memo[key] = definition;
      }

      return memo;
    }, {});

    registerProvider(Provider);
    bootstrapFn(typeOptions);
  };
}
