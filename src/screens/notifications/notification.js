/*
 * File: notification.js
 * Project: mariposa
 * File Created: Monday, 19th August 2019 2:37:05 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 11:59:49 am
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import t from 'prop-types';
const RemoveButton = ({onPress}) => (
  <View style={styles.removeContainer}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.removeButton}>
        <Image
          style={styles.removeIcon}
          source={require('../../../assets/images/trash.png')}
        />
        <Text style={styles.removeText}>ELIMINAR</Text>
      </View>
    </TouchableOpacity>
  </View>
);
RemoveButton.propTypes = { 
  onPress: t.func,
};
export default class Notification extends Component {
  render() {
    return (
      <Swipeable renderRightActions={() => <RemoveButton />}>
        <View style={styles.notification}>
          <Image
            style={styles.image}
            source={require('../../../assets/images/alert.png')}
          />
          <View style={{backgroundColor: 'white'}}>
            <Text style={styles.title}> ¡Tu licencia vence hoy! Apurate </Text>
            <Text style={styles.message}>
              {' '}
              Para obtener más información, ingresa a este sitio web.{' '}
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomColor: '#C8CBD1',
    borderBottomWidth: 1,
    paddingBottom: 14,
    paddingTop: 36,
  },
  image: {
    width: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    color: '#475563',
  },
  message: {
    fontSize: 12,
    fontFamily: 'Raleway-Regular',
    color: '#475563',
  },
  removeButton: {
    backgroundColor: '#B70016',
    width: 42,
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeContainer: {
    width: 42,
    marginTop: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  removeIcon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
  },
  removeText: {
    height: 11,
    width: 81,
    color: '#FFFFFF',
    fontFamily: 'Raleway-Bold',
    fontSize: 5,
    textAlign: 'center',
  },
});
