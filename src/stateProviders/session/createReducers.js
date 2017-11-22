import { combineReducers } from 'redux';

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

function createReducer(initialState = {}, name) {
  return (state = initialState, { type, payload }) => {
    const [prefix, setter, scope, key] = type.split(':');

    if (prefix !== 'JDRS' || scope !== name) {
      return state;
    }

    if (!setter || !setters[setter]) {
      throw new Error(`Unknown state setter "${setter}"`);
    }

    return setters[setter](state, { key, payload }, name);
  };
}

export default function createReducers(options) {
  if (!Object.keys(options).length) {
    return (s = {}) => s;
  }

  return combineReducers(
    Object.keys(options).reduce((memo, name) => {
      const { initialState } = options[name];

      // eslint-disable-next-line no-param-reassign
      memo[name] = createReducer(initialState, name);

      return memo;
    }, {}),
  );
}
