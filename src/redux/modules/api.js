/*
 * File: api.js
 * Project: mariposa
 * File Created: Monday, 30th September 2019 2:02:03 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 7th October 2019 12:38:38 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {devlog} from '../../utils/log';
import {INITIAL_ENV} from '../../config';

const initialState = INITIAL_ENV;

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case 'SET_ENV': {
    return action.payload;
  }
  default:
    return state;
  }
}

export const setApiEnv = env => {
  return {
    type: 'SET_ENV',
    payload: env,
  };
};

export const toggleApiEnv = () => {
  const options = ['qa', 'piloto'];
  return (dispatch, getState, {api}) => {
    const currentState = getState().api;
    const newState =
      options[
        (options.findIndex(e => e === currentState) + 1) % options.length
      ];
    devlog('upa');
    dispatch(setApiEnv(newState));
    api.changeEnv(newState);
  };
};

export const selectApiEnv = env => {
  return (dispatch, getState, {api}) => {
    dispatch(setApiEnv(env));
    api.changeEnv(env);
  };
};
