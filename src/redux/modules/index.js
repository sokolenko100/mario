/*
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 4:58:13 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 12:43:13 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {combineReducers} from 'redux';
import {persistReducer, createMigrate} from 'redux-persist';
import transforms from './persistTransforms';
import localState from './localState';
import auth from './auth';
import emergency from './emergency';
import map from './map';
import trips from './trips';
import paymentMethod from './paymentMethod';
import cars from './cars';
import faqs from './faqs';
import api from './api';
import tripsDetail from './tripsDetail';

// increment by one to force persist drop
const VERSION = 2;

// create all necessary migrations, all are equals
const migrations = Array.from({ length: VERSION }).map((_, i) => i).reduce((allMigrations, version) => {
  return {
    ...allMigrations,
    [version]: state => ({
      auth: { data: state.auth ? state.auth.data || {} : {}}
    })
  };
}, {});


export default storage => {
  const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['hydratation', 'router', 'localState', 'api'],
    version: VERSION - 1,
    transforms,
    migrate: createMigrate(migrations, { debug: false })
  };

  /**
   * Add new reducers here
   */
  const combinedReducer = combineReducers({
    localState,
    auth,
    emergency,
    map,
    trips,
    paymentMethod,
    cars,
    faqs,
    api,
    tripsDetail
  });

  const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
      state = undefined;
    }
    return combinedReducer(state, action);
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  return persistedReducer;
};
