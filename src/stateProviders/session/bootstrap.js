import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import createReducers from './createReducers';
import Provider from './Provider';
import createBootstrap from '../../';

let store = null;

export function getStore() {
  return store;
}

export default createBootstrap(
  'session',
  options => {
    store = createStore(createReducers(options), devToolsEnhancer());
  },
  Provider,
);
