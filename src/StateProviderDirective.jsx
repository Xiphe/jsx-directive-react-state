import React from 'react';

const providers = [];

export function registerProvider(Provider) {
  providers.push(Provider);
}

export default function StateProviderDirective({ next, Elm, props }) {
  return providers.reduce((children, Provider) => {
    return <Provider>{children}</Provider>;
  }, next(Elm, props));
}
