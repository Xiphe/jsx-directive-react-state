import { connect } from 'react-redux';

const selectorsMap = new WeakMap();
const nothing = {};

function mapStateToProps(_, ownProps) {
  if (!ownProps.options) {
    return nothing;
  }

  if (!selectorsMap.has(ownProps)) {
    if (ownProps.options.setter) {
      selectorsMap.set(ownProps, {});
    } else {
      selectorsMap.set(ownProps, (state) => {
        const { key, scope } = ownProps.options;

        if (!state[scope]) {
          throw new Error(`Can not use state "${scope}" if it's not initialized.`);
        }

        return {
          [ownProps.as || key]: state[scope][key],
        };
      });
    }
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

function mapDispatchToProps(dispatch, ownProps) {
  if (!ownProps.options || !ownProps.options.setter) {
    return nothing;
  }

  const { key, scope, setter } = ownProps.options;

  return {
    [ownProps.as || setter](value) {
      const action = {
        type: `JDRS:${setter.toUpperCase()}:${scope}:${key}`,
      };
      const payload = getPayload(setter, value);

      if (payload !== undefined) {
        action.payload = payload;
      }

      dispatch(action);
    },
  };
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

