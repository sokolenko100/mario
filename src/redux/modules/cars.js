/*
 * File: cars.js
 * Project: mariposa
 * File Created: Wednesday, 4th September 2019 5:51:34 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 5th November 2019 12:49:56 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import difference from 'lodash/difference';
import {
  createReducer,
  requestAction,
  errorType,
  getToken,
  getUUID,
  showError,
} from '../utils';
import {getCurrentLocation} from './map';
import {getTrips} from './trips';
import {formatPlateNumber} from '../../utils/text';

const initialState = {data: {}, loading: false};
const type = 'CARS';

const SET_CARS = 'SET_CARS';
const PATCH_CARS = 'PATCH_CARS';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_CARS]: (state, payload) => ({
      ...state,
      data: payload.reduce(
        (all, car) => ({
          ...all,
          [car.subscriptionId]: {
            ...state.data[car.voucherId],
            ...car,
          },
        }),
        {},
      ),
    }),
    [PATCH_CARS]: (state, payload) => {
      return {
        ...state,
        data: payload.reduce(
          (all, car) => ({
            ...all,
            [car.subscriptionId]: {
              ...all[car.subscriptionId],
              ...car,
              id: car.subscriptionId,
            },
          }),
          state.data,
        ),
      };
    },
  },
});

export const getCarsInfo = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const request = () =>
        api
          .withToken(getToken({getState}))
          .car.all({uuid: getUUID({getState})});
      const currentCars = Object.values(getState().cars.data)
        .filter(car => car.voucherId)
        .map(car => car.voucherId);
      const carsFromUserData = getState().auth.data.vouchers;
      await requestAction({
        dispatch,
        type,
        request: async () => {
          const {payload} = await request();
          dispatch(
            setCars({
              cars: payload.map(car => {
                return {
                  ...car,
                  model:
                    car.model.length > 12
                      ? car.model.substring(0, 12) + '...'
                      : car.model,
                  plateNumber: formatPlateNumber(car.plateNumber),
                  voucherId: car.voucherId === 'null' ? null : car.voucherId,
                  ...(carsFromUserData.find(voucher => voucher.subscriptionId === car.subscriptionId) || {})
                };
              }),
            }),
          );
        },
      });
      const afterRequestCars = Object.values(getState().cars.data)
        .filter(car => car.voucherId)
        .map(car => car.voucherId);
      if (
        [
          ...difference(currentCars, afterRequestCars),
          ...difference(afterRequestCars, currentCars),
        ].length
      ) {
        dispatch(getCurrentLocation());
      }
      if (!currentCars.length && afterRequestCars.length) {
        dispatch(getTrips());
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

export const enableCar = ({subscriptionId}) => {
  return async (dispatch, getState, {api}) => {
    try {
      const request = async () => {
        await api.withToken(getToken({getState})).trip.activeSubscription({
          uuid: getUUID({getState}),
          subscriptionId,
        });
      };
      await requestAction({dispatch, type, request});
      dispatch(getCarsInfo());
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
    }
  };
};

export const patchCar = ({subscriptionId, mileage, ...data}) => {
  return async (dispatch, getState, {api}) => {
    const currentCar = getState().cars.data[subscriptionId];
    try {
      const request = async () => {
        await api.withToken(getToken({getState})).car.patch({
          uuid: getUUID({getState}),
          subscriptionId,
          data: {
            ...data,
            initKm: Number(mileage),
          },
        });
      };
      dispatch({
        type: PATCH_CARS,
        payload: [{subscriptionId, mileage: String(Number(mileage)), ...data}],
      });
      await requestAction({dispatch, type, request});
      return true;
    } catch (e) {
      dispatch({
        type: errorType(type),
        payload: e.message,
      });
      showError(e);
      await requestAction({
        dispatch,
        type,
        request: () => {
          dispatch({type: PATCH_CARS, payload: [currentCar]});
        },
      });

      return false;
    }
  };
};

export const setCars = ({cars}) => {
  return {
    type: SET_CARS,
    payload: cars,
  };
};
