import { connect } from 'react-redux';

const selectorsMap = new WeakMap();

function mapStateToProps(_, ownProps) {
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

const dispatchMap = new WeakMap();
function mapDispatchToProps(dispatch, ownProps) {
  if (!dispatchMap.has(ownProps)) {
    if (!ownProps.options.setter) {
      dispatchMap.set(ownProps, {});
    } else {
      const { key, scope, setter } = ownProps.options;

      dispatchMap.set(ownProps, {
        [ownProps.as || setter](value) {
          const action = {
            type: `PATTERNSON:${setter.toUpperCase()}:${scope}:${key}`,
          };
          const payload = getPayload(setter, value);

          if (payload !== undefined) {
            action.payload = payload;
          }

          dispatch(action);
        },
      });
    }
  }

  return dispatchMap.get(ownProps);
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

