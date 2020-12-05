/*
 * File: button.js
 * Project: mariposa
 * File Created: Wednesday, 7th August 2019 11:14:23 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 12:45:06 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Constants from '../utils/constants';
import t from 'prop-types';
const Button = ({
  loading = false,
  text,
  loadingText = '',
  whiteMode = false,
  stylesExternal = {},
  onPress = () => {},
  disabled,
  shadow = false,
}) => {
  if (disabled) return <TouchableOpacity
    style={styles.buttonHeiglight}
    disabled>
    <View
      style={[styles.LinearGradientStyle, 
        styles.greyButton]}>
      <Text
        style={[styles.buttonText, {color: '#fff'}]}>
        {loading ? loadingText : text}
      </Text>
    </View>
  </TouchableOpacity>;
  return (
    <TouchableOpacity
      style={[styles.buttonHeiglight, shadow && styles.shadow]}
      disabled={loading}
      onPress={onPress}>
      <LinearGradient
        colors={
          whiteMode
            ? ['white', 'white']
            : [Constants.themeColor, Constants.gradientlowColor]
        }
        style={[styles.LinearGradientStyle, stylesExternal]}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}
        locations={[0, 1]}>
        <Text
          style={[styles.buttonText, {color: whiteMode ? '#4BA4CB' : '#fff'}]}>
          {loading ? loadingText : text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  loading: t.bool,
  text: t.string,
  loadingText: t.string,
  whiteMode: t.bool,
  stylesExternal: t.object,
  onPress: t.func,
  disabled: t.bool,
  shadow: t.bool
};
export default Button;
const styles = StyleSheet.create({
  buttonHeiglight: {
    height: 38,
    borderRadius: 10,
  },
  greyButton: {
    backgroundColor: 'rgb(146, 152, 161)'
  },
  LinearGradientStyle: {
    height: 36,
    width: 288,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Raleway-Bold',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }
});
