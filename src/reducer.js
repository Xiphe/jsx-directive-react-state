/* global PATTERNSON_ENV */

import { combineReducers } from 'redux';
import { firebaseStateReducer as firebase } from 'redux-react-firebase';

const namespaces = [
  'user',
  'shared',
  'session',
  'ui',
];

const setters = {
  SET(state, { key, payload }) {
    return {
      ...state,
      [key]: payload,
    };
  },
  TOGGLE(state, { key }) {
    const payload = !state[key];

    return setters.SET(state, { key, payload });
  },
};

const initialState = PATTERNSON_ENV.initialState || {};

export default combineReducers(namespaces.reduce((memo, namespace) => {
  // eslint-disable-next-line no-param-reassign
  memo[namespace] = (state = (initialState[namespace] || {}), { type, payload }) => {
    const [
      PATTERNSON,
      setter,
      scope,
      key,
    ] = type.split(':');

    if (PATTERNSON !== 'PATTERNSON' || scope !== namespace) {
      return state;
    }

    if (!setter || !setters[setter]) {
      throw new Error(`Unknown PatternsOn state setter "${setter}"`);
    }

    return setters[setter](state, { key, payload });
  };

  return memo;
}));

