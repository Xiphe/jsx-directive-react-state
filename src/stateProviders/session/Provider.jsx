import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { getStore } from './bootstrap';

export default function SessionStateProvider({ children }) {
  return <ReduxProvider store={getStore()}>{children}</ReduxProvider>;
}
