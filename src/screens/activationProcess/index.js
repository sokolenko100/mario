/*
 * File: index.js
 * Project: mariposa
 * File Created: Thursday, 29th August 2019 12:47:07 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 30th August 2019 9:59:22 am
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {Container, Content} from 'native-base';
import Header from '../../reusable/header';
import Button from '../../reusable/button';
const {width} = Dimensions.get('window');
export default class ActivationProcess extends Component {
  render() {
    return (
      <Container>
        <Header title={'PROCESO DE ACTIVACIÓN'} />
        <Content style={styles.container}>
          <Button text={'SINCRONIZAR'} />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.09,
    paddingTop: 84,
    paddingBottom: 46,
  },
});
