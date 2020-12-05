/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 6th September 2019 12:18:15 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 23rd September 2019 12:28:43 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {useEffect} from 'react';
import {useSelector} from 'react-redux';

const ValidateAuth = ({navigation}) => {
  const uuid = useSelector(state => state.auth.data.uuid);
  useEffect(() => {
    if (uuid) {
      navigation.navigate('app');
    } else {
      navigation.navigate('login');
    }
  }, [navigation, uuid]);
  return null;
};

export default ValidateAuth;
