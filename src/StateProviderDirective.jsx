import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';

const store = configureStore();

export default function StateProviderDirective({ Elm, props, next}) {
  return (
    <Provider store={store}>
      {next(Elm, props)}
    </Provider>
  );
}
