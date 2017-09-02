function performSet(state, { scope, key, value }) {
  if (!scope) {
    return Object.assign({}, state, {
      [key]: value,
    });
  }

  return Object.assign({}, state, {
    [scope]: performSet(state[scope] || {}, { key, value }),
  });
}

export default function reducer(state = { user: {} }, { type, payload }) {
  if (type.indexOf('PATTERNSON:SET:') === 0) {
    const tokens = type.split(':');

    return performSet(state, { scope: tokens[2], key: tokens[3], value: payload });
  }

  return state;
}
