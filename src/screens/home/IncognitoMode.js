/*
 * File: IncognitoMode.js
 * Project: mariposa
 * File Created: Wednesday, 7th August 2019 12:29:17 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 12:29:58 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import Button from '../../reusable/button';
import {connect} from 'react-redux';
import {toggleIncognito} from '../../redux/modules/map';
import t from 'prop-types';
const {height} = Dimensions.get('window');

const IncognitoMode = ({show, toggleIncognito}) => {
  if (!show) {
    return null;
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.flexView}>
          <View style={styles.flexSpace} />
          <View style={styles.info}>
            <Image
              source={require('../../../assets/images/incognito.png')}
              style={styles.image}
            />
            <Text style={[styles.text, styles.title]}>MODO INCÓGNITO</Text>
            <Text style={[styles.text, styles.content]}>
              Tus viajes no quedarán registrados, pero el servicio de E-call
              sigue activo
            </Text>
          </View>
          <View style={styles.button}>
            <Button text="DESACTIVAR" onPress={toggleIncognito} whiteMode />
          </View>
        </View>
      </View>
    </>
  );
};
IncognitoMode.propTypes = {
  show: t.bool,
  toggleIncognito: t.func
};

const styles = StyleSheet.create({
  flexSpace: {
    flexGrow: 3,
  },
  flexView: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: '#475563',
    zIndex: 2,
  },
  info: {
    flexDirection: 'column',
    // marginTop: 151 + 20,
    flexGrow: 5,
    alignItems: 'center',
    // justifyContent: 'space-between',
    flex: 1,
    marginBottom: 77,
  },
  image: {
    width: height * 0.21,
    height: height * 0.21,
    marginBottom: 20,
    marginTop: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: height * 0.08 + 30,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 22,
    lineHeight: 26,
    marginBottom: 10,
  },
  content: {
    fontFamily: 'Raleway-Regular',
    fontSize: 20,
    lineHeight: 18,
    marginHorizontal: 30,
    // padding: 30,
    // marginBottom: 10,
  },
});
const mapStateToProps = ({map: {selected, incognitoIds = []}}) => {
  return {
    show: incognitoIds.includes(selected),
  };
};
const mapDispatchToProps = dispatch => ({
  toggleIncognito: () => dispatch(toggleIncognito()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IncognitoMode);
