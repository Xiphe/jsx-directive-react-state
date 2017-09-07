import { connect } from 'react-redux';

const defaultScope = 'user';

const selectorsMap = new WeakMap();

function mapStateToProps(_, ownProps) {
  if (!selectorsMap.has(ownProps)) {
    const selectors = ownProps.options.filter(({ type }) => {
      return !type || type === 'get';
    }).reduce((memo, { key, as, scope = defaultScope }) => {
      memo.push({
        key: as || key,
        get(state) {
          return state[scope][key];
        },
      });

      return memo;
    }, []);

    selectorsMap.set(ownProps, (state) => {
      return selectors.reduce((memo, { key, get }) => {
        // eslint-disable-next-line no-param-reassign
        memo[key] = get(state);

        return memo;
      }, {});
    });
  }

  return selectorsMap.get(ownProps);
}

function getPayload(setter, value) {
  switch (setter) {
    case 'toggle':
      return undefined;
    default:
      return value.target ? value.target.value : value;
  }
}

function mapDispatchToProps(dispatch, { options }) {
  return options.filter(({ type }) => {
    return type === 'set';
  }).reduce((memo, { key: someKey, as: someAs, scope = defaultScope, setter = 'set' }) => {
    const key = someAs || `set${someKey[0].toUpperCase()}${someKey.slice(1)}`;

    // eslint-disable-next-line no-param-reassign
    memo[key] = (value) => {
      const action = {
        type: `PATTERNSON:${setter.toUpperCase()}:${scope}:${someKey}`,
      };
      const payload = getPayload(setter, value);

      if (payload !== undefined) {
        action.payload = payload;
      }

      dispatch(action);
    };

    return memo;
  }, {});
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    props: {
      ...stateProps,
      ...dispatchProps,
      ...ownProps.props,
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(({ Elm, props, next }) => {
  return next(Elm, props);
});

