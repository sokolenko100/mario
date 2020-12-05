/*
 * File: emergency.js
 * Project: mariposa
 * File Created: Monday, 29th July 2019 11:40:41 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Friday, 15th November 2019 10:35:25 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {createReducer, requestAction, errorType, showError, getToken} from '../utils';

const initialState = {data: [], loading: false};
const type = 'EMERGENCY';

const SET_EMERGENCY = 'SET_EMERGENCY';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_EMERGENCY]: (state, payload) => ({
      ...state,
      data: payload,
    }),
  },
});

export const getEmergencyNumbers = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const request = () => api.withToken(getToken({ getState })).emergency.get();
      const {payload} = await requestAction({dispatch, type, request});
      dispatch({type: SET_EMERGENCY, payload});
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};
