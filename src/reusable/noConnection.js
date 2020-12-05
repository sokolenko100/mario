/*
 * File: noConnection.js
 * Project: mariposa
 * File Created: Friday, 30th August 2019 5:06:38 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Wednesday, 4th September 2019 12:12:41 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {View, Image} from 'react-native';

export default class NoConnection extends Component {
  render() {
    return (
      <View style={{position: 'absolute', top: '35%', left: '10%'}}>
        <Image
          source={require('../../assets/images/no_conexion.png')}
          style={{width: 300, height: 36, resizeMode: 'contain'}}
        />
      </View>
    );
  }
}
