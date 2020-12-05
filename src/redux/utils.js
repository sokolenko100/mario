// import {Toast} from 'native-base';

/*
 * File: utils.js
 * Project: MiAuto
 * File Created: Wednesday, 24th July 2019 3:08:13 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Friday, 22nd November 2019 11:35:04 am
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import crashlytics from '@react-native-firebase/crashlytics';

export const fetchStart = type => `${type}_FETCH_START`;
export const fetchEnd = type => `${type}_FETCH_END`;
export const errorType = type => `${type}_ERROR`;

export const requestAction = async ({dispatch, type, request}) => {
  try {
    dispatch({type: fetchStart(type)});
    const data = await request();
    dispatch({type: fetchEnd(type)});
    return data;
  } catch (e) {
    dispatch({type: fetchEnd(type)});
    const {isAxiosError} = e;
    if(e.response.data.message === 'Unauthorized. Access token is missing or invalid.' && e.response.data.statusCode === 401) {
      dispatch({type: 'RESET'});
    }
    if (isAxiosError) {
      const {
        response: {
          data: {status},
        },
        config: {url},
      } = e;
      if (status === 401)
        dispatch({type: 'RESET'});
      await crashlytics().setAttributes({
        type: 'api',
        url,
      });
      crashlytics().recordError(e);
    }

    throw e;
  }
};

export const getToken = ({getState}) => {
  return getState().auth.data.tokens;
};

export const getUUID = ({getState}) => {
  return getState().auth.data.uuid;
};
export const getDni = ({getState}) => {
  return getState().auth.data.dni;
};

export const createReducer = ({cases, initialState, type}) => (
  state = initialState,
  action,
) => {
  switch (action.type) {
  case fetchStart(type):
    return {
      ...state,
      loading: true,
      error: null,
    };
  case fetchEnd(type):
    return {
      ...state,
      loading: false,
    };
  case errorType(type):
    return {
      ...state,
      error: action.payload,
    };
  default:
    if (cases[action.type]) {
      return cases[action.type](state, action.payload);
    }
    return state;
  }
};

export const showError = e => {
  const {isAxiosError} = e;
  return isAxiosError;
  // if (isAxiosError) {
  //   const {
  //     response: {
  //       data: {status, message, detail},
  //     },
  //     config: {url},
  //   } = e;
  //   Toast.show({
  //     type: 'danger',
  //     text: `[ERROR ${status}] ${message}, ${detail} (in ${url})`,
  //     duration: 4000,
  //   });
  // }
};
