/*
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 4:55:28 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Monday, 7th October 2019 12:39:37 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import {persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import logger from 'redux-logger';
import reducers from './modules';
import {SHOULD_LOG} from '../config';
// import {selectApiEnv} from './modules/api';

export default function configureStore(
  initialState = {},
  api,
  customStorage = AsyncStorage,
) {
  // Setup middleware
  const middleware = [thunk.withExtraArgument({api}), promise];
  if (SHOULD_LOG) {
    middleware.push(logger);
  }

  // Setup middlewares and enhancers
  const enhancer = compose(applyMiddleware(...middleware));

  // Create redux store
  const store = createStore(reducers(customStorage), initialState, enhancer);
  const persistor = persistStore(store);
  // TODO: REMOVE ON STABLE
  // setInterval(() => {
  //   const {getState, dispatch} = store;
  //   if (getState().api !== api.env()) {
  //     dispatch(selectApiEnv(getState().api));
  //   }
  // }, 2000);
  return {
    store,
    persistor,
  };
}
