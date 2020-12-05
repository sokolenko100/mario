/*
 * File: fingerprint.js
 * Project: mariposa
 * File Created: Wednesday, 3rd July 2019 11:25:40 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Wednesday, 3rd July 2019 12:16:19 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

export default class Fingerprint extends Component {
  componentDidMount() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttempted,
    })
      .then(() => {
        this.props.navigation.navigate('c2');
      })
      .catch(error => {
        this.setState({errorMessage: error.message});
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }
  render() {
    return <View />;
  }
}

// const styles = StyleSheet.create({});
