/*
 * File: bottomDrawer.js
 * Project: mariposa
 * File Created: Tuesday, 9th July 2019 10:29:12 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 5th November 2019 3:27:55 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Text, View, Dimensions, StyleSheet, Image} from 'react-native';
import t from 'prop-types';
import { devlog } from '../../utils/log';
const {width, height} = Dimensions.get('window');

const StatusImage = ({status}) => {
  const image = {
    0: require('../../../assets/images/proceso_1.png'),
    1: require('../../../assets/images/proceso_2.png'),
    2: require('../../../assets/images/proceso_2.png'),
  }[status];
  return (
    <>
      <Text style={styles.title}>PROCESO DE ACTIVACIÓN</Text>
      <Image testID="processImage" source={image} style={styles.process1} />
    </>
  );
};
StatusImage.propTypes ={
  status: t.number,
};

export class BottomDrawer extends PureComponent {
  render() {
    const {
      selected: {activated, enabled, dateSentActivated, cancelled},
    } = this.props;
    devlog({ a : this.props });
    const status = cancelled ? null : activated
      ? null
      : !enabled && !activated && !dateSentActivated
        ? 0
        : enabled && !dateSentActivated
          ? 1
          : !enabled && dateSentActivated
            ? 2
            : null;
    return Number.isInteger(status) ? (
      <View style={styles.container}>
        {Number.isInteger(status) ? (
          <StatusImage status={status} />
        ) : (
          <Text>Auto conectado</Text>
        )}
      </View>
    ) : null;
  }
}
BottomDrawer.propTypes = {
  selected: t.object
};

const mapStateToProps = ({
  map: {data: mapsCars, selected: subscriptionId},
  cars: {data: carsInfo},
}) => {
  if (!subscriptionId && Object.keys(carsInfo).length > 0) return { selected : {cancelled: true }};
  return {
    selected: {...mapsCars[subscriptionId], ...carsInfo[subscriptionId]} || {
      mock: true,
    },
  };
};

export default connect(mapStateToProps)(BottomDrawer);
const styles = StyleSheet.create({
  container: {
    width: width * 0.96,
    height: height * 0.22,
    left: width * 0.02,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20 + height * 0.08,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C8CBD1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 2,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: '#475563',
    marginBottom: 16,
  },
  process1: {
    width: width * 0.85,
    height: 72,
    resizeMode: 'contain',
  },
});
