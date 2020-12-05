/*
 * File: map.js
 * Project: mariposa
 * File Created: Monday, 29th July 2019 2:27:09 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 5th November 2019 12:53:27 pm
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
  showError,
  getUUID,
} from '../utils';

const initialState = {
  data: {},
  loading: false,
  incognitoIds: [],
  selected: null,
};
const type = 'MAP';

const SET_LOCATION = 'SET_LOCATION';
const ADD_TO_INCOGNITO = 'ADD_TO_INCOGNITO';
const REMOVE_FROM_INCOGNITO = 'REMOVE_FROM_INCOGNITO';
const SET_SELECTED = 'SET_SELECTED';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_LOCATION]: (state, payload) => ({
      ...state,
      data: payload.reduce(
        (all, location) => ({
          ...all,
          [location.subscriptionId]: {
            ...location,
          },
        }),
        {},
      ),
    }),
    [ADD_TO_INCOGNITO]: (state, payload) => ({
      ...state,
      incognitoIds: [...state.incognitoIds, payload],
    }),
    [REMOVE_FROM_INCOGNITO]: (state, payload) => ({
      ...state,
      incognitoIds: state.incognitoIds.filter(
        subscriptionId => payload !== subscriptionId,
      ),
    }),
    [SET_SELECTED]: (state, payload) => ({
      ...state,
      selected: payload,
    }),
  },
});

export const getCurrentLocation = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const {
        auth: {
          data: {uuid},
        },
        cars: {data},
      } = getState();
      const request = () =>
        Promise.all(
          Object.entries(data)
            .filter(([, {activated, voucherId, cancelled}]) => activated && voucherId && !cancelled)
            .map(([, {voucherId}]) => {
              const {subscriptionId} = Object.values(getState().cars.data).find(
                car => car.voucherId === voucherId,
              );
              return api
                .withToken(getToken({getState}))
                .map.getLocation({uuid, voucherId})
                .then(({payload}) => {
                  if (!payload.latitude) {
                    return null;
                  }
                  return {
                    ...payload,
                    voucherId,
                    subscriptionId,
                  };
                });
            }),
        );
      dispatch(getIncognitosStatus());
      const payload = await requestAction({dispatch, type, request});
      dispatch({
        type: SET_LOCATION,
        payload: [
          ...payload.filter(e => e),
        ],
      });
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};

export const selectCar = id => ({
  type: SET_SELECTED,
  payload: id,
});

const enableIncognito = ({voucherId, subscriptionId}) => {
  return async (dispatch, getState, {api}) => {
    try {
      dispatch({type: ADD_TO_INCOGNITO, payload: subscriptionId});
      await api
        .withToken(getToken({getState}))
        .map.enableIncognito({uuid: getUUID({getState}), voucherId});
    } catch (e) {
      // dispatch({type: REMOVE_FROM_INCOGNITO, payload: subscriptionId});
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};
const disableIncognito = ({voucherId, subscriptionId}) => {
  return async (dispatch, getState, {api}) => {
    try {
      dispatch({type: REMOVE_FROM_INCOGNITO, payload: subscriptionId});
      await api
        .withToken(getToken({getState}))
        .map.disableIncognito({uuid: getUUID({getState}), voucherId});
    } catch (e) {
      // dispatch({type: ADD_TO_INCOGNITO, payload: subscriptionId});
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};

export const toggleIncognito = () => {
  return (dispatch, getState) => {
    const subscriptionId = getState().map.selected;
    const {voucherId} = getState().cars.data[subscriptionId];
    const isInIncognito = getState().map.incognitoIds.includes(subscriptionId);
    if (!isInIncognito)
      return dispatch(enableIncognito({voucherId, subscriptionId}));
    return dispatch(disableIncognito({voucherId, subscriptionId}));
  };
};

const getIncognitosStatus = () => {
  return async (dispatch, getState, { api }) => {
    const uuid = getUUID({ getState });
    const token = getToken({ getState });
    const cars = Object.values(getState().cars.data);
    const request = () => Promise.all(cars.map(async ({ voucherId }) => {
      return {
        voucherId,
        data: await api.withToken(token).car.getIncognitoInfo({ uuid, voucherId })
      };
    }));
    const data = await requestAction({dispatch, type, request});
    data.forEach(({ voucherId, data: { payload: {activated} }}) => {
      const {subscriptionId} = Object.values(getState().cars.data).find(car => car.voucherId === voucherId);
      if (activated) {
        dispatch({type: ADD_TO_INCOGNITO, payload: subscriptionId});
      } else {
        dispatch({type: REMOVE_FROM_INCOGNITO, payload: subscriptionId});
      }
    });
  };
};