/**
 * File: header.js
 * Project: mariposa
 * File Created: Wednesday, 3rd July 2019 3:00:17 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 12:40:34 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * Last Modified: Friday, 12th July 2019 1:27:01 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {StyleSheet, View, Image, TouchableWithoutFeedback} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Header, Body, Title, Left, Right} from 'native-base';
import t from 'prop-types';
import PropTypes from 'prop-types';
// import { TouchableNativeFeedback } from 'react-native-gesture-handler';
class header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Header style={styles.header} androidStatusBarColor="#696969">
          <Left style={{flex: 1}}>
            {this.props.withBack && (
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.goBack()}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 25,
                  }}>
                  <Image
                    source={require('../../assets/images/back_azul.png')}
                    style={{height: 12, width: 7, resizeMode: 'contain'}}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
          </Left>
          <Body style={{flex: 7, justifyContent: 'center'}}>
            <Title style={styles.title}>{this.props.title}</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
      </View>
    );
  }
}
header.propTypes = {
  withBack: t.bool,
};

export default withNavigation(header);
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F4F4F4',
  },
  title: {
    color: '#475563',
    fontFamily: 'Raleway-Bold',
  },
});

header.propTypes = {
  title: PropTypes.string,
};
