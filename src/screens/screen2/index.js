/**
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 5:45:26 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 1:23:34 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Text, Thumbnail} from 'native-base';

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const uri =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';
    return (
      <View>
        <Text> Screen2 </Text>

        <Thumbnail square large source={{uri: uri}} />
        <Button
          block
          success
          onPress={() => this.props.navigation.navigate('c1')}>
          <Text>To screen1</Text>
        </Button>
      </View>
    );
  }
}
