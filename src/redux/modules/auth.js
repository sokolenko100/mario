/*
 * File: auth.js
 * Project: mariposa
 * File Created: Monday, 29th July 2019 10:23:29 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Friday, 22nd November 2019 11:27:36 am
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  createReducer,
  requestAction,
  errorType,
  getToken,
  getUUID,
  showError,
} from '../utils';
import { rutValidate, rutFormat } from 'rut-helpers';
import Auth from 'appcenter-auth';
import { getCarsInfo } from './cars';
import { getPaymentMethod, requestPayment } from './paymentMethod';
import decode from 'jwt-decode';

const initialState = { data: { email: '' }, loading: false };
const type = 'AUTH';

const SET_USER = 'SET_USER';
const PATCH_USER = 'PATCH_USER';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_USER]: (state, payload) => ({
      ...state,
      data: payload,
    }),
    [PATCH_USER]: (state, payload) => ({
      ...state,
      data: { ...state.data, ...payload },
    }),
  },
});

export const loginAction = () => {
  return async (dispatch, getState, { api }) => {
    try {
      if (!getToken({ getState })) {
        const { accessToken } = await Auth.signIn();
        const jwt = accessToken;
        const { emails: [email] } = decode(jwt);
        dispatch({ type: SET_USER, payload: { tokens: { jwt }, email } });
      }
      const token = getToken({ getState });
      const validateUserExist = async () => requestAction({ dispatch, type, request: () => api.withToken(token).auth.validateToken() });
      let data;
      try {
        data = await validateUserExist();
      } catch {
        return { existUser: false };
      }
      const { uuid, tyc } = data.payload;
      dispatch(logoutAction());
      dispatch({
        type: SET_USER,
        payload: {
          // ...payload,
          tokens: token,
          uuid,
          tyc,
        },
      });
      await Promise.all([
        analytics().setUserId(uuid),
        analytics().logEvent('login', { uuid }),
        crashlytics().setUserId(uuid),
      ]);
      await dispatch(getUserInfo());
      return { tyc, existUser: true };
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: 'UPS! los datos no coinciden, intenta nuevamente',
      });
      showError(e);
    }
  };
};

export const createUserDni = ({ dni }) => {
  return async (dispatch, getState, { api }) => {
    try {
      const token = getToken({ getState });
      const request = () => api.withToken(token).auth.createUserDni({ dni: rutFormat(dni).split('.').join('') });
      await requestAction({ dispatch, type, request });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
      Auth.signOut();
    }
  };
};

export const getUserInfo = ({ uuid, jwt } = {}) => {
  return async (dispatch, getState, { api }) => {
    try {
      const request = () =>
        api
          .withToken(jwt ? { jwt } : getToken({ getState }))
          .user.get({ uuid: uuid || getUUID({ getState }) });
      await requestAction({
        dispatch,
        type,
        request: async () => {
          const { payload } = await request();
          dispatch({ type: PATCH_USER, payload });
        },
      });
      await Promise.all([
        dispatch(getCarsInfo()),
        dispatch(getPaymentMethod()),
      ]);
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
    }
  };
};

const validateLoginData = ({ dni, password }) => {
  // let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  // let dniRegex = /^(\d{1,3}(?:\d{1,3}){2}-[\dkK])$/;
  if (!rutValidate(dni)) {
    return {
      error: true,
      message: 'Ingrese un rut válido',
    };
  }
  if (password === '') {
    return {
      error: true,
      message: 'Contraseña no puede estar vacio',
    };
  }
  return { error: false };
};

export const validateAuthData = ({ dni, password = '1234' }) => {
  return dispatch => {
    const validate = validateLoginData({ dni, password });
    if (validate.error) {
      dispatch({ type: errorType(type), payload: validate.message });
    }
  };
};

export const validateDni = dni => {
  return dispatch => {
    const validate = validateLoginData({ dni, password: '1234' });
    if (validate.error) {
      return dispatch({ type: errorType(type), payload: validate.message });
    }
    return dispatch({ type: errorType(type), payload: null });
  };
};

export const validatePassword = password => {
  return dispatch => {
    const validate = validateLoginData({ dni: '11111111-1', password });
    if (validate.error) {
      return dispatch({ type: errorType(type), payload: validate.message });
    }
    return dispatch({ type: errorType(type), payload: null });
  };
};

export const updateUser = ({ telephone, address }) => {
  return async (dispatch, getState, { api }) => {
    const prevState = getState().auth.data;
    try {
      const request = () =>
        api
          .withToken(getToken({ getState }))
          .user.patch({ uuid: getUUID({ getState }), telephone, address });
      dispatch({ type: PATCH_USER, payload: { telephone, address } });
      await requestAction({
        dispatch,
        type,
        request,
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      await requestAction({
        dispatch,
        type,
        request: () =>
          dispatch({
            type: SET_USER,
            payload: prevState,
          }),
      });

      showError(e);
      throw e;
    }
  };
};

export const updatePictureUser = ({ uri, name, type: imageType }) => {
  return async (dispatch, getState, { api }) => {
    const prevState = getState().auth.data;
    try {
      const request = () =>
        api.withToken(getToken({ getState })).user.uploadProfilePicture({
          uuid: getUUID({ getState }),
          uri,
          name,
          type: imageType,
        });
      await requestAction({
        dispatch,
        type,
        request: async () => {
          const {
            payload: { urlAbsolute: avatar },
          } = await request();
          dispatch({ type: PATCH_USER, payload: { avatar } });
        },
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      requestAction({
        dispatch,
        type,
        request: () =>
          dispatch({
            type: SET_USER,
            payload: prevState,
          }),
      });

      showError(e);
      throw e;
    }
  };
};

export const acceptTerms = () => {
  return async (dispatch, getState, { api }) => {
    try {
      const request = () =>
        api
          .withToken(getToken({ getState }))
          .user.acceptTerms({ uuid: getUUID({ getState }) });
      dispatch({ type: PATCH_USER, payload: { tyc: true } });
      await requestAction({
        dispatch,
        type,
        request,
      });
      dispatch(requestPayment(true));
      return true;
    } catch (e) {
      if (
        e.response.data.detail === 'Client already signed Terms and Conditions'
      ) {
        dispatch(requestPayment(true));
        return;
      }
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      dispatch({ type: PATCH_USER, payload: { tyc: false } });

      showError(e);
    }
  };
};

export const recoverPassword = ({ dni }) => {
  return async (dispatch, getState, { api }) => {
    const validate = validateLoginData({ dni, password: '12345' });
    if (validate.error) {
      dispatch({ type: errorType(type), payload: validate.message });
      return { error: validate.message };
    }
    try {
      const request = () =>
        api.auth.recoverPassword({ dni: dni.split('.').join('') });
      await requestAction({
        dispatch,
        type,
        request,
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
      return e.message;
    }
  };
};

export const createPassword = ({ acpasstoken, password, rPassword }) => {
  return async (dispatch, getState, { api }) => {
    if (password !== rPassword) {
      dispatch({
        type: errorType(type),
        payload: 'Las contraseñas no son iguales',
      });
      return;
    }
    try {
      const request = () => api.auth.createPassword({ acpasstoken, password });
      await requestAction({
        dispatch,
        type,
        request,
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: 'Ups! Hubo un error al crear la contraseña. Intente de nuevo',
      });
      showError(e);
      throw new Error('error on backend');
    }
  };
};

export const requestCreateUser = ({ dni }) => {
  return async (dispatch, getState, { api }) => {
    const validate = validateLoginData({ dni, password: '12345' });
    if (validate.error) {
      dispatch({ type: errorType(type), payload: validate.message });
      return { error: validate.message };
    }
    try {
      const request = () =>
        api.auth.requestNewUserMail({ dni: dni.split('.').join('') });
      await requestAction({
        dispatch,
        type,
        request,
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
      return e.message;
    }
  };
};

export const createUser = ({ token, dni, password, rPassword }) => {
  return async (dispatch, getState, { api }) => {
    if (password !== rPassword) {
      dispatch({
        type: errorType(type),
        payload: 'Las contraseñas no son iguales',
      });
      return;
    }
    const validate = validateLoginData({ dni, password });
    if (validate.error) {
      dispatch({ type: errorType(type), payload: validate.message });
      return;
    }
    try {
      const request = () =>
        api.auth.createUser({ token, dni: dni.split('.').join(''), password });
      await requestAction({
        dispatch,
        type,
        request,
      });
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: 'Ups! Hubo un error al crear la contraseña. Intente de nuevo',
      });
      showError(e);
      throw new Error('error on backend');
    }
  };
};

export const logoutAction = () => {
  // return {
  //   type: 'RESET',
  // };
  return (dispatch) => {
    Auth.signOut();
    dispatch({
      type: 'RESET',
    });
  };
};


export const validateNewUserToken = ({ token }) => {
  return async (dispatch, getState, { api }) => {
    try {
      const request = () => api.auth.validateNewUserToken({ token });
      await requestAction({ dispatch, type, request });
      return true;
    } catch (e) {
      return false;
    }
  };
};

export const validatePasswordToken = ({ token }) => {
  return async (dispatch, getState, { api }) => {
    try {
      const request = () => api.auth.validatePasswordToken({ token });
      await requestAction({ dispatch, type, request });
      return true;
    } catch (e) {
      return false;
    }
  };
};