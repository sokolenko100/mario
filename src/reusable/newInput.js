/*
 * File: newInput
 * Project: mariposa
 * File Created: Thursday, 29th August 2019 3:05:26 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 1:14:37 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet, View, Input} from 'react-native';
import t from 'prop-types';
export default class NewInput extends Component {
  render() {
    return (
      <View>
        <Input keyboardType={this.props.type ? this.props.type : 'default'} />
      </View>
    );
  }
}
NewInput.propTypes = {
  type: t.any,
};
// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({});
