/*
 * File: avatarPlaceholder.js
 * Project: mariposa
 * File Created: Thursday, 5th September 2019 3:26:28 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:25:38 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import t from 'prop-types';
export default class AvatarPlaceholder extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.circle}>
        <Text style={styles.text}>{this.props.initials}</Text>
      </View>
    );
  }
}
AvatarPlaceholder.propTypes = {
  initials: t.string,
};
const styles = StyleSheet.create({
  circle: {
    width: 125,
    height: 125,
    marginTop: 30,
    marginBottom: 24,
    borderRadius: 125 / 2,
    backgroundColor: '#6A81BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Raleway-Bold',
    fontSize: 70,
    color: 'white',
  },
});
