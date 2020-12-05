/*
 * File: dynamicLinks.js
 * Project: mariposa
 * File Created: Monday, 23rd September 2019 12:22:25 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 8th October 2019 4:34:08 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {NavigationActions} from 'react-navigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {getParamsFromUrl, getPathFromUrl} from './url';
import {validateRegisterStatus} from '../redux/modules/paymentMethod';

export const handleDynamicLink = async ({navigator, dispatch}) => {
  const navigateToLink = response => {
    const path = getPathFromUrl(
      response.url,
      'https://auto-conectado-qa.azurewebsites.net/',
    );
    const params = getParamsFromUrl(response.url);
    const action = {
      ['nueva-contrasena']: () =>
        navigator.dispatch(
          NavigationActions.navigate({routeName: 'createPassword', params}),
        ),
      ['auth/confirmar-pago']: () =>
        dispatch(validateRegisterStatus({token: params.token})),
      ['nuevo-usuario']: () =>
        navigator.dispatch(
          NavigationActions.navigate({routeName: 'createUser', params}),
        ),
    }[path];
    if (action) {
      action();
    }
  };
  dynamicLinks().onLink(navigateToLink);
  const initialLink = await dynamicLinks().getInitialLink();
  if (initialLink) {
    navigateToLink(initialLink);
  }
};
