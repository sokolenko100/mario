/*
 * File: construction.js
 * Project: mariposa
 * File Created: Friday, 5th July 2019 5:37:18 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:10:05 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import t from 'prop-types';
export default class Construction extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/images/esperando_activacion.png')}
        />
        <Text style={styles.title}>
          {this.props.title ? this.props.title : 'Esperando'}
        </Text>
        <Text style={styles.text}>
          {this.props.message
            ? this.props.message
            : 'No podemos mostrar en este momento información'}
        </Text>
      </View>
    );
  }
}
Construction.propTypes = {
  title: t.string,
  message: t.string,
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: 249,
    height: 105,
    marginTop: 120,
    marginBottom: 45,
  },
  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 22,
    color: '#475563',
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'Raleway-Regular',
    fontSize: 20,
    color: '#475563',
    textAlign: 'center',
    maxWidth: 268,
  },
});
