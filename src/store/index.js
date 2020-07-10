import {persistStore} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import createStore from './createStore';
import persistReducers from './persistReducers';

import reducers from './ducks';
import sagas from './sagas';

const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;

const sagaMiddleware = createSagaMiddleware({sagaMonitor});

const middlewares = [sagaMiddleware];

const store = createStore(persistReducers(reducers), middlewares);

const persistor = persistStore(store);

sagaMiddleware.run(sagas);

export {store, persistor};
