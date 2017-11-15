import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import createReducers from './createReducers';

let store = null;

export function getStore() {
  return store;
}

export default function bootstrap(options) {
  store = createStore(
    createReducers(options),
    devToolsEnhancer(),
  );
}
