/*
 * File: App.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 5:23:58 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Wednesday, 9th October 2019 1:15:00 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import configureStore from './src/redux/';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import RootStack from './src/';
import SplashScreen from 'react-native-splash-screen';

import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Root} from 'native-base';
import requests from './src/utils/requests';

// if (process.env.NODE_ENV !== 'production') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React);
// }

export const App = (store, persistor) =>
  gestureHandlerRootHOC(() => (
    <Provider store={store}>
      <Root>
        <PersistGate persistor={persistor}>
          <RootStackWrapper />
        </PersistGate>
      </Root>
    </Provider>
  ));

export class RootStackWrapper extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return <RootStack />;
  }
}
const RealApp = () => {
  const {store: defaultStore, persistor: defaultPersistor} = configureStore(
    {},
    requests,
  );
  return App(defaultStore, defaultPersistor);
};

export default RealApp;
