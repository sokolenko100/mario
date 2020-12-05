/*
 * File: modalTerms
 * Project: mariposa
 * File Created: Monday, 19th August 2019 4:43:52 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 1:19:20 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import t from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import Constants from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {acceptTerms} from '../redux/modules/auth';
const {width} = Dimensions.get('window');

class ModalTerms extends Component {
  static propTypes = {
    visible: t.bool,
    closeModal: t.func,
    acceptTerms: t.func
  };
  render() {
    const {visible, navigation, acceptTerms, ...props} = this.props;
    return (
      <Modal
        isVisible={visible}
        backdropColor="#243142"
        backdropOpacity={0.5}
        {...props}>
        <View style={styles.card}>
          <View style={[styles.cardHeader, styles.cardHeaderDanger]}>
            <Text style={styles.header}>TÉRMINOS Y CONDICIONES</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.body}>
              Acepto los Términos y Condiciones, la Política de Privacidad y
              autorizo el tratamiento de mis datos personales en Chile o en el
              extranjero.
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('terms');
              }}>
              <Text style={styles.bodyBold}>TÉRMINOS Y CONDICIONES</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.action} onPress={acceptTerms}>
              <LinearGradient
                colors={[Constants.themeColor, Constants.gradientlowColor]}
                style={styles.button}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                locations={[0, 1]}>
                <Text style={[styles.buttonText]}>ACEPTAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  visible:
    state.auth.data.uuid && !state.auth.data.tyc && !state.localState.terms,
});

const mapDispatchToProps = dispatch => ({
  acceptTerms: () => dispatch(acceptTerms()),
});

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalTerms),
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.89,
    borderRadius: 11,
    backgroundColor: 'white',
    shadowColor: 'rgba(255,255,255,0.37)',
    shadowOffset: {height: 7, width: 2},
    alignSelf: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fafafa',
    borderRadius: 11,
  },
  header: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#475563',
    textAlign: 'center',
  },
  cardBody: {
    marginVertical: 22,
    marginHorizontal: 30,
  },
  body: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#475563',
    textAlign: 'center',
    marginBottom: 32,
  },
  bodyBold: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
    lineHeight: 22,
    color: '#475563',
    textAlign: 'center',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    width: width * 0.68,
    backgroundColor: '#c8cbd1',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  action: {
    paddingTop: 14,
    paddingBottom: 21,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 16,
  },
  mainActionText: {
    fontFamily: 'Raleway-Bold',
  },
  button: {
    flexDirection: 'row',
    width: width * 0.76,
    height: 35,
    backgroundColor: '#4BA4CB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: 'white',
  },
});
