import { combineReducers } from 'redux';

const setters = {
  SET(state, { key, payload }, name) {
    if (Array.isArray(payload)) {
      throw new Error(`Can not set array value to key "${key}" of state "${name}"`);
    }

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

function createReducer(initialState = {}, name) {
  return (state = initialState, { type, payload }) => {
    const [
      PATTERNSON,
      setter,
      scope,
      key,
    ] = type.split(':');

    if (PATTERNSON !== 'PATTERNSON' || scope !== name) {
      return state;
    }

    if (!setter || !setters[setter]) {
      throw new Error(`Unknown PatternsOn state setter "${setter}"`);
    }

    return setters[setter](state, { key, payload }, name);
  };
}

export default function createReducers(options) {
  return combineReducers(Object.keys(options).reduce((memo, name) => {
    const { initialState } = options[name];

    // eslint-disable-next-line no-param-reassign
    memo[name] = createReducer(initialState, name);

    return memo;
  }, {}));
}

