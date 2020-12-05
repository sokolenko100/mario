/*
 * File: trips.js
 * Project: mariposa
 * File Created: Tuesday, 30th July 2019 1:50:36 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 12:39:44 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import {flatten} from 'lodash';
import {
  createReducer,
  requestAction,
  errorType,
  getToken,
  getUUID,
  showError,
} from '../utils';
import {getDate, addDays, parse} from '../../utils/datetimes';
import { getTripDetail } from './tripsDetail';
const initialState = {
  data: {},
  filters: {voucherIds: [], dateRange: []},
  loading: false,
  oldestDate: new Date(),
  newestDate: new Date(),
};
const type = 'TRIPS';

const SET_TRIPS = 'SET_TRIPS';
const INSERT_TRIP = 'INSERT_TRIP';
const SET_OLDER_TRIPS = 'SET_OLDER_TRIPS';
const SET_TRIP = 'SET_TRIP';
const GET_NEXT_PAGE_TRIPS = 'GET_NEXT_PAGE_TRIPS';
const REMOVE_TRIP = 'REMOVE_TRIP';
const CLEAR_TRIPS = 'CLEAR_TRIPS';
const SET_VOUCHER_IDS_FILTER = 'SET_VOUCHER_IDS_FILTER';
const SET_DATE_RANGE_FILTER = 'SET_DATE_RANGE_FILTER';
const CLEAN_TRIPS_FILTER = 'CLEAN_TRIPS_FILTER';

const DELTA_DAYS = -1;

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_TRIPS]: (state, payload) => ({
      ...state,
      data: payload.data.reduce(
        (trips, trip) => ({
          [trip.id]: trip,
          ...trips,
        }),
        // state.data, // mantain state -> maybe filter data issues
        {} // reset state -> loading issues
      ),
      oldestDate: payload.oldestDate,
      newestDate: payload.newestDate,
    }),
    [INSERT_TRIP]: (state, payload) => ({
      ...state,
      data: {
        ...state.data,
        [payload.id]: payload,
      },
    }),
    [SET_OLDER_TRIPS]: (state, payload) => {
      return {
        ...state,
        data: payload.data.reduce(
          (trips, trip) => ({
            [trip.id]: trip,
            ...trips,
          }),
          state.data,
        ),
        oldestDate: payload.oldestDate,
      };
    },
    [GET_NEXT_PAGE_TRIPS]: (state, payload) => ({
      ...state,
      data: [...state.data, ...payload],
      page: state.page + 1,
    }),
    [REMOVE_TRIP]: (state, payload) => {
      const data = {...state.data};
      delete data[payload];
      return {
        ...state,
        data,
      };
    },
    [CLEAR_TRIPS]: state => {
      return {
        ...state,
        data: {}
      };
    },
    [SET_TRIP]: (state, payload) => {
      return {
        ...state,
        data: {
          ...state.data,
          [payload.id]: {
            ...state.data[payload.id],
            ...payload,
          },
        },
      };
    },
    [SET_VOUCHER_IDS_FILTER]: (state, payload) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          voucherIds: payload.voucherIds,
        },
      };
    },
    [SET_DATE_RANGE_FILTER]: (state, payload) => {
      return {
        ...state,
        filters: {
          ...state.filters,
          dateRange: payload.dateRange
        }
      };
    },
    [CLEAN_TRIPS_FILTER]: state => {
      return {
        ...state,
        filters: {
          dateRange: [],
          voucherIds: []
        }
      };
    }
  },
});

export const getRangeDate = ({ getState }) => {
  let [filterInitialDate, filterEndDate] = (getState().trips.filters || {}).dateRange || [];
  // If only one element in range, then both are equal (one day filter)
  if (filterInitialDate && !filterEndDate) filterEndDate = filterInitialDate;

  // get oldest date of ready cars
  const initialDateByCars = Object.values(getState().cars.data).reduce((min, car) => {
    if (min > parse(car.dateReadyOcto)) return parse(car.dateReadyOcto);
    return min;
  }, new Date());
  const endDateByNow = new Date();
  // If there is filter, use that date ranges
  return [
    filterInitialDate && parse(filterInitialDate) > initialDateByCars ? parse(filterInitialDate) : initialDateByCars,
    filterEndDate && parse(filterEndDate) < endDateByNow ? parse(filterEndDate) : endDateByNow,
    filterEndDate && parse(filterEndDate) < endDateByNow // using filter date boolean
  ];
};
export const getTrips = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const uuid = getUUID({getState});
      
      // Get all voucher ids from cars
      const voucherIds = Object.entries(getState().cars.data)
        .filter(([, val]) => val.activated && val.voucherId && !val.cancelled)
        .map(([, {voucherId}]) => voucherId);

      // Set start and end date for trips request. The oldest date cant be older than initial date
      let [initialDate, newestDate ] = getRangeDate({ getState });
      let newOldestDate = addDays(newestDate, DELTA_DAYS);
      let oldestDate = newOldestDate > initialDate ? newOldestDate : initialDate; 
      
      // Fetch trips for all vouchers ids in set dates
      const request = () =>
        Promise.all(
          voucherIds.map(voucherId => {
            return api.withToken(getToken({getState})).trip.all({
              endDate: getDate(newestDate),
              startDate: getDate(oldestDate),
              voucherId,
              uuid,
            });
          }),
        );

      // Do requests until data exists or initial date reached
      let data = [];
      await requestAction({
        dispatch,
        type,
        request: async () => {
          data = flatten(await request());
          while (!data.length && oldestDate > (initialDate)) {
            newestDate = oldestDate; // eslint-disable-line require-atomic-updates
            newOldestDate = addDays(newestDate, DELTA_DAYS);
            oldestDate = newOldestDate > initialDate ? newOldestDate : initialDate; // eslint-disable-line require-atomic-updates
            data = flatten(await request()); // eslint-disable-line require-atomic-updates
          }
          return data;
        },
      });
      data.forEach(trip => dispatch(getTripDetail({ tripId: trip.id, voucherId: trip.voucherId })));
      dispatch({
        type: SET_TRIPS,
        payload: {
          data,
          newestDate,
          oldestDate,
        },
      });
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};
export const getOlderTrips = () => {
  return async (dispatch, getState, {api}) => {
    
    if (getState().trips.loading) {
      return null;
    }
    let newestDate = getState().trips.oldestDate;
    let [initialDate] = getRangeDate({ getState });
    if (newestDate < new Date(initialDate)) {
      return;
    }
    try {
      const voucherIds = Object.entries(getState().cars.data)
        .filter(([, val]) => val.activated && val.voucherId)
        .map(([, {voucherId}]) => voucherId);
      const uuid = getUUID({getState});

      // Set start and end date for trips request. The oldest date cant be older than initial date
      let newOldestDate = addDays(newestDate, DELTA_DAYS);
      let oldestDate = newOldestDate > initialDate ? newOldestDate : initialDate; 
      
      // Fetch trips for all vouchers ids in set dates
      const request = () =>
        Promise.all(
          voucherIds.map(voucherId => {
            return api.withToken(getToken({getState})).trip.all({
              endDate: getDate(newestDate),
              startDate: getDate(oldestDate),
              voucherId,
              uuid,
            });
          }),
        );

      // Do requests until data exists or initial date reached
      let data = [];
      await requestAction({
        dispatch,
        type,
        request: async () => {
          data = flatten(await request());
          while (!data.length && oldestDate > (initialDate)) {
            newestDate = oldestDate; // eslint-disable-line require-atomic-updates
            newOldestDate = addDays(newestDate, DELTA_DAYS);
            oldestDate = newOldestDate > initialDate ? newOldestDate : initialDate; // eslint-disable-line require-atomic-updates
            data = flatten(await request()); // eslint-disable-line require-atomic-updates
          }
          return data;
        },
      });
      data.forEach(trip => dispatch(getTripDetail({ tripId: trip.id, voucherId: trip.voucherId })));
      dispatch({
        type: SET_OLDER_TRIPS,
        payload: {
          data,
          oldestDate,
        },
      });
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};

export const setAddress = id => {
  return async (dispatch, getState, {api}) => {
    try {
      const {startGPS, endGPS} = getState().trips.data[id];
      const [startDirection, endDirection] = await Promise.all([
        api.trip.getAddress(...startGPS.split(',')),
        api.trip.getAddress(...endGPS.split(',')),
      ]);
      dispatch({
        type: SET_TRIP,
        payload: {
          id,
          startDirection,
          endDirection,
        },
      });
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};

export const removeTrip = ({id}) => {
  return async (dispatch, getState, {api}) => {
    const trip = getState().trips.data[id];
    try {
      const {voucherId, id: tripId, startDate, endDate} = trip;
      const uuid = getUUID({getState});
      const jwt = getToken({getState});
      const request = () =>
        api.withToken(jwt).trip.remove({uuid, voucherId, tripId, startDate, endDate});
      dispatch({type: REMOVE_TRIP, payload: id});
      await requestAction({dispatch, type, request});
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      dispatch({type: INSERT_TRIP, payload: trip});
      showError(e);
    }
  };
};

export const setVoucherIdsFilter = ({voucherIds}) => {
  return dispatch => {
    dispatch({
      type: SET_VOUCHER_IDS_FILTER,
      payload: {voucherIds},
    });
  };
};

export const setDateRangeFilter = ({dateRange}) => {
  return dispatch => {
    dispatch({
      type: SET_DATE_RANGE_FILTER,
      payload: {dateRange},
    });
  };
};

export const cleanFilter = () => {
  return {
    type: CLEAN_TRIPS_FILTER
  };
};
export const clearTrips = () => {
  return  {
    type: CLEAR_TRIPS
  };
};
