/*
 * File: checkbox.js
 * Project: mariposa
 * File Created: Wednesday, 7th August 2019 10:55:21 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:13:39 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Image} from 'react-native';
import t from 'prop-types';
const Checkbox = ({checked, onCheck}) => {
  return (
    <TouchableWithoutFeedback onPress={onCheck}>
      <View style={[styles.container, styles.size, checked && styles.checked]}>
        {checked ? (
          <Image
            style={styles.size}
            source={require('../../assets/images/checkbox_selected.png')}
          />
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};
Checkbox.propTypes = {
  checked: t.bool,
  onCheck: t.func,
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#243142',
    borderRadius: 9,
    backgroundColor: '#fff',
    marginRight: 5,
    marginTop: 2,
  },
  size: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  checked: {
    borderWidth: 0,
  },
});

export default Checkbox;
