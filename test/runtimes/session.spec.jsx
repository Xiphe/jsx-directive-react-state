/* eslint-disable no-console */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import SessionDirective, { bootstrap } from '../../src/stateProviders/session';
import StateProviderDirective from '../../src/StateProviderDirective';

Enzyme.configure({ adapter: new Adapter() });

function terminator(Elm, props) {
  return <Elm {...props} />;
}

function Provider({ children }) {
  return <StateProviderDirective Elm="div" props={{}} next={() => children} />;
}

function withState({ options, as }) {
  return WrappedComponent => {
    return props => {
      return (
        <SessionDirective
          Elm={WrappedComponent}
          options={options}
          as={as}
          props={props}
          next={terminator}
        />
      );
    };
  };
}

const originalConsoleError = console.error;

function noop() {}

describe('session runtime', () => {
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders without error', () => {
    const SimpleDiv = withState({})('div');

    bootstrap({ foo: { type: 'session' } });

    const tree = renderer
      .create(
        <Provider>
          <SimpleDiv />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders data from initial state', () => {
    const BazDiv = withState({
      options: { key: 'bar', scope: 'foo' },
    })(({ bar }) => {
      return <div>{bar}</div>;
    });

    bootstrap({ foo: { type: 'session', initialState: { bar: 'baz' } } });

    const tree = renderer
      .create(
        <Provider>
          <BazDiv />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders renamed data from initial state', () => {
    const BazDiv = withState({
      options: { key: 'bar', scope: 'foo' },
      as: 'children',
    })('div');

    bootstrap({ foo: { type: 'session', initialState: { bar: 'baf' } } });

    const tree = renderer
      .create(
        <Provider>
          <BazDiv />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('retrieves data previously set by setter', () => {
    const LoremSpan = withState({
      options: { key: 'lorem', scope: 'foo' },
      as: 'children',
    })('span');
    const IpsumButton = withState({
      options: { key: 'lorem', scope: 'foo', setter: 'set' },
    })(({ set }) => {
      return <button onClick={() => set('ipsum')}>click me</button>;
    });

    bootstrap({ foo: { type: 'session', initialState: { lorem: null } } });

    const wrapper = mount(
      <Provider>
        <div>
          <LoremSpan />
          <IpsumButton />
        </div>
      </Provider>,
    );

    expect(wrapper.find('span').prop('children')).toBe(null);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('span').prop('children')).toBe('ipsum');
  });

  it('retrieves data obtained by a change handler', () => {
    const DisplayName = withState({
      options: { key: 'surname', scope: 'name' },
      as: 'children',
    })('span');
    const NameInput = withState({
      options: { key: 'surname', scope: 'name', setter: 'set' },
      as: 'onChange',
    })('input');

    bootstrap({ name: { type: 'session', initialState: { surname: '' } } });

    const wrapper = mount(
      <Provider>
        <div>
          <DisplayName />
          <NameInput />
        </div>
      </Provider>,
    );

    expect(wrapper.find('span').prop('children')).toBe('');
    wrapper.find('input').simulate('change', { target: { value: 'God' } });
    expect(wrapper.find('span').prop('children')).toBe('God');
  });

  it('can handle toggled actions', () => {
    const YesNo = withState({
      options: { key: 'yes', scope: 'onoff' },
    })(({ yes }) => {
      return <span>{yes ? 'yes' : 'no'}</span>;
    });
    const Checkbox = withState({
      options: { key: 'yes', scope: 'onoff', setter: 'toggle' },
    })(({ toggle }) => {
      return <input type="checkbox" onClick={toggle} />;
    });

    bootstrap({ onoff: { type: 'session', initialState: { yes: true } } });

    const wrapper = mount(
      <Provider>
        <div>
          <YesNo />
          <Checkbox />
        </div>
      </Provider>,
    );

    expect(wrapper.find('span').prop('children')).toBe('yes');
    wrapper.find('input').simulate('click');
    expect(wrapper.find('span').prop('children')).toBe('no');
  });

  it('throws when a unknown state is used', () => {
    const BazDiv = withState({
      options: { key: 'bar', scope: 'foo' },
      as: 'children',
    })('div');

    bootstrap({ bar: { type: 'session', initialState: { bar: 'baf' } } });

    console.error = noop;
    expect(() => {
      renderer
        .create(
          <Provider>
            <BazDiv />
          </Provider>,
        )
        .toJSON();
    }).toThrowErrorMatchingSnapshot();
  });

  it('throws when a unknown setter is used', () => {
    const Checkbox = withState({
      options: { key: 'bar', scope: 'foo', setter: 'baz' },
    })(({ baz }) => {
      return <input type="checkbox" onClick={baz} />;
    });

    bootstrap({ foo: { type: 'session', initialState: { bar: 'baf' } } });

    const wrapper = mount(
      <Provider>
        <Checkbox />
      </Provider>,
    );

    expect(() => {
      wrapper.find('input').simulate('click');
    }).toThrowErrorMatchingSnapshot();
  });

  it('has no access to non-session state types', () => {
    bootstrap({ bar: { type: 'nope', initialState: { bar: 'baf' } } });

    const BazDiv = withState({
      options: { key: 'bar', scope: 'foo' },
      as: 'children',
    })('div');

    console.error = noop;
    expect(() => {
      renderer
        .create(
          <Provider>
            <BazDiv />
          </Provider>,
        )
        .toJSON();
    }).toThrowErrorMatchingSnapshot();
  });
});
