/*
 * File: DetailInfo.js
 * Project: mariposa
 * File Created: Thursday, 1st August 2019 10:10:59 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 12th August 2019 5:22:07 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React from 'react';
import t from 'prop-types';
import {StyleSheet, Image, Dimensions} from 'react-native';
import {Text, Col} from 'native-base';

let {width} = Dimensions.get('window');
const DetailInfo = ({source, text}) => (
  <Col style={styles.detailBox}>
    <Image style={styles.detailIcon} source={source} />
    <Text style={styles.detailText}>{text}</Text>
  </Col>
);
DetailInfo.propTypes = {
  source: t.any.isRequired,
  text: t.string.isRequired,
};

const styles = StyleSheet.create({
  detailIcon: {
    height: 25,
    width: width * 0.0667,
    resizeMode: 'contain',
  },
  detailText: {
    color: '#243142',
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
  },
  detailBox: {alignItems: 'center'},
});

export default DetailInfo;
