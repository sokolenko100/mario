/*
 * File: paymentMethod.js
 * Project: mariposa
 * File Created: Wednesday, 21st August 2019 10:33:18 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 11:56:54 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {
  createReducer,
  requestAction,
  errorType,
  getToken,
  getDni,
  showError,
} from '../utils';

const initialState = {
  data: {},
  registerUrl: {},
  loading: false,
  requestPayment: false,
  success: false,
};
const type = 'PAYMENT_METHOD';

const SET_METHOD = 'SET_METHOD';
const SET_REGISTER_URL = 'SET_REGISTER_URL';
const SET_REQUEST_PAYMENT = 'SET_REQUEST_PAYMENT';
const SET_SUCCESS = 'SET_SUCCESS';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_METHOD]: (state, payload) => ({
      ...state,
      data: payload,
      registerUrl: {},
      error: null,
    }),
    [SET_SUCCESS]: (state, payload) => ({
      ...state,
      success: payload,
    }),
    [SET_REGISTER_URL]: (state, payload) => ({
      ...state,
      registerUrl: payload,
    }),
    [SET_REQUEST_PAYMENT]: (state, payload) => ({
      ...state,
      requestPayment: payload,
      registerUrl: {},
    }),
  },
});

export const requestPaymentMethod = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const dni = getDni({getState});
      const token = getToken({getState});
      const {
        payload: { creditCardType },
      } = await requestAction({
        dispatch,
        type,
        request: () => api.withToken(token).paymentMethod.getCustomerId({dni}),
      });
      if (!creditCardType) {
        dispatch(requestPayment(true));
      }
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
    }
  };
};

export const getPaymentMethod = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const dni = getDni({getState});
      const token = getToken({getState});
      const {
        payload: {customerId, creditCardType, last4CardDigits, status},
      } = await requestAction({
        dispatch,
        type,
        request: () => api.withToken(token).paymentMethod.getCustomerId({dni}),
      });
      dispatch({
        type: SET_METHOD,
        payload: {customerId, creditCardType, last4CardDigits, status},
      });
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
    }
  };
};

export const getPaymentMethodRegisterUrl = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const apiToken = getToken({getState});
      const {customerId} = getState().paymentMethod.data;
      const {
        payload: {url, token},
      } = await requestAction({
        dispatch,
        type,
        request: () =>
          api.withToken(apiToken).paymentMethod.getRegisterUrl({customerId}),
      });
      dispatch({
        type: SET_REGISTER_URL,
        payload: {url, token},
      });
      return {url, token};
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
      return {};
    }
  };
};

export const validateRegisterStatus = ({token}) => {
  return async (dispatch, getState, {api}) => {
    try {
      const apiToken = getToken({getState});
      const {
        payload: {customerId, creditCardType, last4CardDigits, status},
      } = await requestAction({
        dispatch,
        type,
        request: () =>
          api.withToken(apiToken).paymentMethod.getRegisterStatus({token}),
      });
      if (creditCardType !== '') {
        dispatch({
          type: SET_METHOD,
          payload: {customerId, creditCardType, last4CardDigits, status},
        });
        dispatch({type: SET_SUCCESS, payload: true});
        setTimeout(() => {
          dispatch(requestPayment(false));
        }, 5000);
      } else {
        dispatch({
          type: errorType(type),
          payload: 'credit card not registered',
        });
      }
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
    }
  };
};

export const requestPayment = request => ({
  type: SET_REQUEST_PAYMENT,
  payload: request,
});
