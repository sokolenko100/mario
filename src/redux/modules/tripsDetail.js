/*
 * File: tripsDetail.js
 * Project: autoconectado
 * File Created: Tuesday, 29th October 2019 11:39:33 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 29th October 2019 5:36:03 pm
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
};
const type = 'TRIPS_DETAIL';

const SET_TRIP_DETAIL = 'SET_TRIP_DETAIL';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_TRIP_DETAIL]: (state, payload) => ({
      ...state,
      data: {
        ...state.data,
        [payload.tripId]: {
          ...payload,
          mapImageUrl: `https://maps.googleapis.com/maps/api/staticmap?scale=2&path=color:0x0000ff%7Cweight:2%7C${payload.tripRoute}&maptype=roadmap&markers=size:small%7Ccolor:0x6980bf%7Clabel:A%7C${
            payload.startGPS
          }&markers=size:small%7Ccolor:0x243142%7Clabel:B%7C${payload.endGPS}&key=AIzaSyCNf0QyIqA1zlfZfiqEWmfhpyjQJ52YC9k&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e`,
        }
      },
      error: null,
    }),
  },
});

export const getTripDetail = ({ tripId, voucherId }) => {
  return async (dispatch, getState, {api}) => {
    try {
      const uuid = getUUID({getState});
      const token = getToken({getState});
      const {
        payload
      } = await requestAction({
        dispatch,
        type,
        request: () => api.withToken(token).trip.detail({ uuid, voucherId, tripId }),
      });
      dispatch({
        type: SET_TRIP_DETAIL,
        payload: {
          tripId,
          startGPS: `${payload[0].lat},${payload[0].lng}`,
          endGPS: `${payload[payload.length - 1].lat},${payload[payload.length - 1].lng}`,
          tripRoute: payload.map(({ lat, lng }) => `${lat},${lng}`).join('|')},
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

