/*
 * File: test-utils.js
 * Project: mariposa
 * File Created: Tuesday, 27th August 2019 12:07:20 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 27th August 2019 1:03:48 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import requests from './requests-piloto';
import configureStore from '../redux';

const Providers = ({initialState = {}}) => ({children}) => {
  return (
    <Provider store={configureStore(initialState, requests).store}>
      {children}
    </Provider>
  );
};
const customRender = (ui, {initialState, ...options} = {}) =>
  render(ui, {wrapper: Providers({initialState}), ...options});

export * from '@testing-library/react-native';
export {customRender as render};
