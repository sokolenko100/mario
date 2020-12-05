/*
 * File: picker.js
 * Project: mariposa
 * File Created: Thursday, 29th August 2019 3:55:27 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 30th August 2019 9:59:05 am
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Item, Picker} from 'native-base';

export default class AppPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: undefined,
    };
  }
  onValueChange(value) {
    this.setState({
      selected: value,
    });
  }
  render() {
    return (
      <Item picker>
        <Picker
          mode="dropdown"
          style={styles.picker}
          placeholder="Tipo de combustible"
          placeholderStyle={{color: '#bfc6ea'}}
          placeholderIconColor="#007aff"
          selectedValue={this.state.selected2}
          onValueChange={this.onValueChange.bind(this)}
          itemTextStyle={styles.text}
          itemStyle={styles.item}>
          <Picker.Item label="Bencina" value="Bencina" />
          <Picker.Item label="Diesel" value="Diesel" />
        </Picker>
      </Item>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    fontSize: 10,
    fontFamily: 'Raleway-Regular',
    height: 26,
    backgroundColor: '#f4f4f4',
    paddingVertical: 5,
    paddingHorizontal: 3,
  },
  item: {
    borderBottomWidth: 0,
    textAlign: 'right',
  },
  text: {
    fontSize: 10,
    fontFamily: 'Raleway-Regular',
    textAlign: 'right',
  },
});
