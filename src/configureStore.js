import { createStore, compose } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { reduxReactFirebase } from 'redux-react-firebase';
import reducer from './reducer';

const config = {
  apiKey: 'AIzaSyD3mOlW58eRSfkTN3B2TxmeysfnwR-9RVg',
  authDomain: 'cli-demo-staging.firebaseapp.com',
  databaseURL: 'https://cli-demo-staging.firebaseio.com/',
};

export default function configureStore() {
  if (typeof document !== 'undefined') {
    const store = compose(
      reduxReactFirebase(config),
    )(createStore)(
      reducer,
      devToolsEnhancer(),
    );

    firebase.auth().signInAnonymously().catch((error) => {
      console.log('error', error);
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('USER', user);
      } else {
        console.log('noUser');
      }
    });

    return store;
  }

  return createStore(
    reducer,
    devToolsEnhancer(),
  );
}
