import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import '~/config/ReactotronConfig';

import {store, persistor} from './store';
import App from './App';
import {RootSiblingParent} from 'react-native-root-siblings';

export default function Index() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootSiblingParent>
          <StatusBar barStyle="light-content" backgroundColor="#333" />
          <App />
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}
