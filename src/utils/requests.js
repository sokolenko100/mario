/*
 * File: requests.js
 * Project: MiAuto
 * File Created: Monday, 22nd July 2019 11:13:59 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 12:45:14 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import {stringify} from 'querystring';
import {differenceInMinutes} from 'date-fns';
import FastImage from 'react-native-fast-image';
import Api from '../../Api';
import {formatToUTC, startOfDay, endOfDay} from './datetimes';
import {INITIAL_ENV} from '../config';
const getApiData = env => {
  return {
    mock: {
      DERCO_API_URL: 'https://private-cc8da-autoconectado.apiary-mock.com',
      PAYMENT_API_URL:
        'https://private-cc8da-autoconectado.apiary-mock.com/payment/v1',
      BASE_TOKENS: {
        secret: '6ae1cde0fbca466caae3fbf9ee6022e2',
      },
      PAYMENT_BASE_TOKNENS: {
        secret: 'e374545613bc4414ae378630d51ec6ad',
      },
    },
    dev: {
      DERCO_API_URL: 'https://derco-dev.azure-api.net/ac',
      PAYMENT_API_URL: 'https://derco-dev.azure-api.net/ac/payment/v1',
      BASE_TOKENS: {
        secret: '9ae88ed4a98d42169664294cdd40baa4',
      },
      PAYMENT_BASE_TOKNENS: {
        secret: 'e374545613bc4414ae378630d51ec6ad',
      },
    },
    qa: {
      DERCO_API_URL: 'https://derco-qa.azure-api.net/ac',
      PAYMENT_API_URL: 'https://derco-qa.azure-api.net/ac/payment/v1',
      BASE_TOKENS: {
        secret: 'd6b2c297f5f943178583958500bada7e',
      },
      PAYMENT_BASE_TOKNENS: {
        secret: '4c747bcb30e6499eac437e7b105170fb',
      },
    },
    piloto: {
      DERCO_API_URL: 'https://autoconectado.herokuapp.com/api',
      PAYMENT_API_URL:
        'https://private-cc8da-autoconectado.apiary-mock.com/payment/v1',
      BASE_TOKENS: {
        secret: '6ae1cde0fbca466caae3fbf9ee6022e2',
      },
      PAYMENT_BASE_TOKNENS: {
        secret: 'e374545613bc4414ae378630d51ec6ad',
      },
    },
    pilotoDev: {
      DERCO_API_URL: 'http://192.168.1.7:5000/api',
      PAYMENT_API_URL:
        'https://private-cc8da-autoconectado.apiary-mock.com/payment/v1',
      BASE_TOKENS: {
        secret: '6ae1cde0fbca466caae3fbf9ee6022e2',
      },
      PAYMENT_BASE_TOKNENS: {
        secret: 'e374545613bc4414ae378630d51ec6ad',
      },
    },
  }[env];
};

const {
  DERCO_API_URL,
  BASE_TOKENS,
  PAYMENT_API_URL,
  PAYMENT_BASE_TOKNENS,
} = getApiData(INITIAL_ENV);
const DEEPLINK_BASE = 'https://auto-conectado-qa.azurewebsites.net';
// TODO: use new package name for android: miautodigital.derco
const DYNAMIC_LINK_BASE =
  'https://autoconectado.page.link/?apn=miautodigital.derco&isi=1482285044&ibi=derco.autoconectado';

const PAYMENT_CUSTOM_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const requestsGenerator = (
  api = new Api(DERCO_API_URL, BASE_TOKENS),
  paymentApi = new Api(
    PAYMENT_API_URL,
    PAYMENT_BASE_TOKNENS,
    PAYMENT_CUSTOM_HEADERS,
  ),
) => {
  const possibleRequests = {
    auth: {
      login: ({dni, password}) =>
        api.post('/users/v1/login', {dni, pass: password}), //.then(d => ({ payload: { ...d.payload, tyc: false }})),
      recoverPassword: ({dni}) =>
        api.post('/users/v1/login/help', {
          dni,
          urlReturn: `${DYNAMIC_LINK_BASE}&link=${DEEPLINK_BASE}/nueva-contrasena`,
        }),
      createPassword: ({acpasstoken, password}) =>
        api.post('/users/v1/login/help/reset', {
          acpasstoken,
          pass: password,
        }),
      requestNewUserMail: ({dni}) =>
        api.post('/users/v1/login/new', {
          dni,
          urlReturn: `${DYNAMIC_LINK_BASE}&link=${DEEPLINK_BASE}/nuevo-usuario`,
        }),
      createUser: ({dni, token, password}) =>
        api.post('/users/v1/activation', {
          dni,
          token,
          pass: password,
        }),
      validateNewUserToken: ({ token }) => api.post(`/users/v1/new/validate?acnewusertoken=${token}`),
      validatePasswordToken: ({ token }) => api.post(`/users/v1/login/help/validate?acpasstoken=${token}`),
      validateToken: () => api.post('/users/v1/login/validate'),
      createUserDni: ({ dni }) => api.post('/users/v1/login/new', { dni })
    },
    user: {
      get: ({uuid}) => api.get(`/users/v1/${uuid}`),
      patch: ({uuid, telephone, address}) =>
        api.patch(`/users/v1/${uuid}`, {telephone, address}),
      uploadProfilePicture: ({uuid, uri, name, type}) => {
        // eslint-disable-next-line no-undef
        const data = new FormData();
        data.append('file', {
          uri,
          name,
          type,
        });
        return api.post(`/vm/v1/uploadfiles/avatar/${uuid}`, data);
      },
      acceptTerms: ({uuid}) => api.post(`/users/v1/${uuid}/termsconditions`),
    },
    paymentMethod: {
      getCustomerId: ({dni}) => paymentApi.get(`/customer/${dni}`),
      getRegisterUrl: ({customerId}) =>
        paymentApi.post(
          '/customer/register',
          stringify({
            customerId,
            urlReturn: `${DEEPLINK_BASE}/flow/callback-frontend`,
          }),
        ),
      getRegisterStatus: ({token}) =>
        paymentApi.get('/customer/register', {
          token,
        }),
    },
    trip: {
      all: async ({startDate, endDate, voucherId, uuid}) => {
        const trips = await api.get(`/octo/v1/${uuid}/trips/${voucherId}`, {
          startDate: formatToUTC(startOfDay(startDate)),
          endDate: formatToUTC(endOfDay(endDate)),
          address: 'y'
        });
        const formattedTrips = trips.payload.map(trip => ({
          voucherId,
          id: trip.tripId,
          startDirection:
            `${trip.startAddress} - ${trip.startCity}` ||
            '',
          endDirection:
            `${trip.endAddress} - ${trip.endCity}` ||
            '',
          startDate: trip.fromDate,
          endDate: trip.toDate,
          distance: Math.trunc((trip.totalDistance / 1000) * 10) / 10,
          oilSpent: trip.estFuelExp || trip.oilSpent,
          maxSpeed: trip.maxSpeed,
          duration: Math.abs(differenceInMinutes(trip.fromDate, trip.toDate)),
          // plateNumber: trip.patetent,
          // mapImageUrl: `https://maps.googleapis.com/maps/api/staticmap?scale=2&path=color:0x0000ff&maptype=roadmap&markers=size:small%7Ccolor:0x6980bf%7Clabel:A%7C${
          //   trip.tripDetail[0].lat
          // },${
          //   trip.tripDetail[0].lng
          // }&markers=size:small%7Ccolor:0x243142%7Clabel:B%7C${`${
          //   trip.tripDetail.slice(-1)[0].lat
          // },${
          //   trip.tripDetail.slice(-1)[0].lng
          // }`}&key=AIzaSyCNf0QyIqA1zlfZfiqEWmfhpyjQJ52YC9k&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e`,
          // mapImageUrl: `https://maps.googleapis.com/maps/api/staticmap?scale=2&path=color:0x0000ff%7Cweight:2%7C${trip.tripDetail
          //   .map(({lat, lng}) => `${lat},${lng}`)
          //   .join(
          //     '|',
          //   )}&maptype=roadmap&markers=size:small%7Ccolor:0x6980bf%7Clabel:A%7C${
          //   trip.tripDetail[0].lat
          // },${
          //   trip.tripDetail[0].lng
          // }&markers=size:small%7Ccolor:0x243142%7Clabel:B%7C${`${
          //   trip.tripDetail.slice(-1)[0].lat
          // },${
          //   trip.tripDetail.slice(-1)[0].lng
          // }`}&key=AIzaSyCNf0QyIqA1zlfZfiqEWmfhpyjQJ52YC9k&maptype=roadmap&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x616161&style=element:labels.text.stroke%7Ccolor:0xf5f5f5&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:road%7Celement:geometry%7Ccolor:0xffffff&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e`,
          // endGPS: `${trip.tripDetail.slice(-1)[0].lat},${
          //   trip.tripDetail.slice(-1)[0].lng
          // }`,
          // startGPS: `${trip.tripDetail[0].lat},${trip.tripDetail[0].lng}`,
          // tripRoute: trip.tripDetail
          //   .map(({lat, lng}) => `${lat},${lng}`)
          //   .join('|'),
        }));
        FastImage.preload(
          formattedTrips.filter(trip =>  trip.mapImageUrl).map(trip => ({uri: trip.mapImageUrl})),
        );
        return formattedTrips;
      },
      detail: ({ uuid, voucherId, tripId }) => api.get(`/octo/v1/${uuid}/trips/${voucherId}/simpledetail/${tripId}`, { address: 'n' }),
      remove: ({uuid, voucherId, tripId, startDate, endDate}) =>
        api.del(`/octo/v1/${uuid}/trips/${voucherId}/detail/${tripId}?startDate=${startDate}&endDate=${endDate}`),
      getAddress: () => 'Dirección 12345',
      activeSubscription: ({uuid, subscriptionId}) =>
        api.post(`/users/v1/${uuid}/subscription/${subscriptionId}`),
    },
    emergency: {
      get: () => api.get('/vm/v1/contacts_support'),
    },
    map: {
      getLocation: async ({uuid, voucherId}) => {
        const request = await api.get(
          `/octo/v1/${uuid}/actual_position/${voucherId}?update=true`,
        );
        if (!request) {
          return {payload: {}};
        }
        const {
          payload: {
            locationpoint: {address, city, ...payload},
          },
        } = request;
        return {
          payload: {
            ...payload,
            address: `${address} - ${city}`,
          },
        };
      },
      enableIncognito: ({uuid, voucherId}) =>
        api.post(`/octo/v1/${uuid}/incognito/${voucherId}/start`),
      disableIncognito: ({uuid, voucherId}) =>
        api.post(`/octo/v1/${uuid}/incognito/${voucherId}/stop`),
    },
    car: {
      all: ({uuid}) =>
        api.get(`users/v1/cars/${uuid}`).then(({payload}) => ({
          payload: payload.map(({mileage, ...car}) => ({
            ...car,
            mileage: Math.trunc(mileage * 10) / 10,
          })),
        })),
      patch: ({uuid, subscriptionId, data}) =>
        api.patch(
          `/users/v1/cars/${uuid}/subscription/${subscriptionId}`,
          data,
        ),
      getIncognitoInfo: ({ uuid, voucherId }) => api.get(`/octo/v1/${uuid}/incognito/${voucherId}/status`)
    },
    faqs: {
      all: () => api.get('vm/v1/faqs'),
    },
    withToken: token =>
      requestsGenerator(
        api.withToken({...BASE_TOKENS, ...token}),
        paymentApi.withToken({...PAYMENT_BASE_TOKNENS, ...token}),
      ),
    changeEnv: env => {
      const {
        DERCO_API_URL: baseUrl,
        BASE_TOKENS: tokens,
        PAYMENT_API_URL: paymentBaseUrl,
        PAYMENT_BASE_TOKNENS: paymentTokens,
      } = getApiData(env);
      api.changeData({baseUrl, token: tokens, env});
      paymentApi.changeData({
        baseUrl: paymentBaseUrl,
        token: paymentTokens,
        env,
      });
    },
    env: () => api.env,
  };
  return possibleRequests;
};

const requests = requestsGenerator();

export default requests;
