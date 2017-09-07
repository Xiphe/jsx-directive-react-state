import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from './configureStore';

const store = configureStore();

export default function StateProviderDirective({ Elm, props, next }) {
  return (
    <Provider store={store}>
      {next(Elm, props)}
    </Provider>
  );
}

StateProviderDirective.propTypes = {
  Elm: PropTypes.node.isRequired,
  props: PropTypes.objectOf(PropTypes.any).isRequired,
  next: PropTypes.func.isRequired,
};
