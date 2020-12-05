/*
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 19th August 2019 2:30:01 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Monday, 19th August 2019 5:11:24 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Notification from './notification';
import Header from '../../reusable/header';
import {Container, Content} from 'native-base';
export default class Notifications extends Component {
  render() {
    return (
      <Container>
        <Header title={'PERFIL'} />
        <Content>
          <View style={styles.container}>
            <Notification />
            <Notification />
            <Notification />
            <Notification />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});
