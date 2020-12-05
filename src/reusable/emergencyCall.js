/*
 * File: emergencyCall.js
 * Project: mariposa
 * File Created: Wednesday, 10th July 2019 4:58:35 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:09:17 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import t from 'prop-types';
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Platform,
  BackHandler,
} from 'react-native';

import {connect} from 'react-redux';
import call from 'react-native-phone-call';
import {toggleFollowMode, hideEmergencyMenu} from '../redux/modules/localState';
import {getEmergencyNumbers} from '../redux/modules/emergency';
import Alert from '../reusable/alert';
import {devlog} from '../utils/log';
const {height, width} = Dimensions.get('window');
class EmergencyCall extends Component {
  static propTypes = {
    close: t.func.isRequired,
    followMode: t.bool.isRequired,
    active: t.bool.isRequired,
    numbers: t.object,
    toggleFollowMode: t.func.isRequired,
    getEmergencyNumbers: t.func.isRequired,
    hideMenu: t.func,
  };
  state = {
    theftModalVisible: false,
    callModal: false,
    call: false,
  };
  toggleTheftModal = () =>
    this.setState(state => ({theftModalVisible: !state.theftModalVisible}));
  theftModalAction = action => () => {
    this.toggleTheftModal();
    if (action) {
      action();
    }
  };
  toggleCallModal = number =>
    this.setState(state => ({
      callModal: !state.callModal,
      number,
      theftModalVisible: false,
      call: false,
    }));
  callModalAction = action => () => {
    this.toggleCallModal();
    if (action) {
      action();
    }
  };

  componentDidMount() {
    const {getEmergencyNumbers, hideMenu} = this.props;
    getEmergencyNumbers();
    this.backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const {active} = this.props;
        if (active) {
          hideMenu();
          return true;
        }
        return false;
      },
    );
  }
  componentWillUnmount() {
    this.backListener.remove();
  }
  doCall = () => {
    const args = {
      prompt: true,
      number: this.state.number,
    };

    call(args).catch(console.error);
  };

  call = type => {
    //handler to make a call

    let number;
    const {numbers} = this.props;
    devlog(numbers);
    switch (type) {
    case 'emergency':
      number = numbers.medicalEmergency;
      break;
    case 'theft_confirmation': {
      return this.toggleTheftModal();
    }
    case 'theft':
      number = numbers.stole;
      break;
    case 'tire':
      number = numbers.neumaticsFailure;
      break;
    case 'fuel':
      number = numbers.batteryFuelFailure;
      break;
    case 'lock':
      number = numbers.locksmith;
      break;
    default:
      number = numbers.other;
      break;
    }
    this.toggleCallModal(number);
  };

  render() {
    if (!this.props.active) {
      return null;
    }
    return (
      <View
        style={[
          styles.container,
          {
            display: 'flex',
            position: 'absolute',
          },
        ]}
        pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={this.props.close}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: height - 60,
              zIndex: -100,
            }}
          />
        </TouchableWithoutFeedback>
        <View style={styles.buttons}>
          <TouchableWithoutFeedback onPress={() => this.call('emergency')}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/iconos/icono_corazon.png')}
              />
              <Text style={styles.textCard}>Urgencia médica</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => this.call('theft_confirmation')}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/iconos/icono_auto.png')}
              />
              <Text style={styles.textCard}>Robo de auto</Text>
            </View>
          </TouchableWithoutFeedback>
          <Alert
            danger
            onModalHide={() => this.state.call && this.call('theft')}
            header="ROBO DE AUTO"
            body="Recuerda que el primer paso en caso de robo es hacer una denuncia en Carabineros. Luego de hacer la denuncia, puedes llamar y un ejecutivo podrá facilitarte la ubicación específica de tu auto al momento de la llamada."
            actions={[
              {text: 'CANCELAR', onPress: this.theftModalAction(() => {})},
              {
                text: 'LLAMAR',
                main: true,
                onPress: this.theftModalAction(() =>
                  this.setState({call: true}),
                ),
              },
            ]}
            visible={this.state.theftModalVisible}
            closeModal={this.toggleTheftModal}
          />
          <TouchableWithoutFeedback onPress={() => this.call('tire')}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/iconos/icono_neumatico.png')}
              />
              <Text style={styles.textCard}>Falla de neumático</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.call('fuel')}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 2,
                }}
                source={require('../../assets/images/iconos/icono_bencinera.png')}
              />
              <Text style={styles.textCard}>Pana combustible / batería</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.call('lock')}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/iconos/icono_llave.png')}
              />
              <Text style={styles.textCard}>Servicio de cerrajería</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Alert
          header="LLAMADA"
          body="¿Estás seguro que quieres iniciar esta llamada?"
          actions={[
            {text: 'CANCELAR', onPress: this.callModalAction(() => {})},
            {
              text: 'LLAMAR',
              main: true,
              onPress: this.callModalAction(() => this.doCall()),
            },
          ]}
          visible={this.state.callModal}
          closeModal={this.toggleCallModal}
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  localState: {followMode},
  emergency: {data: numbers = []},
}) => {
  const numbersObject = numbers.reduce((all, {name, telephone}) => {
    return {...all, [name]: telephone};
  }, {});
  return {
    followMode,
    numbers: {
      medicalEmergency: numbersObject['Emergencia Medica'],
      stole: numbersObject.Robo,
      neumaticsFailure: numbersObject['Fallo de Neumaticos'],
      batteryFuelFailure: numbersObject['Otros problemas'],
      locksmith: numbersObject.Cerrajeria,
      other: numbersObject['Otros problemas'],
    },
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFollowMode: () => {
    dispatch(toggleFollowMode());
    dispatch(hideEmergencyMenu());
  },
  hideMenu: () => dispatch(hideEmergencyMenu()),
  getEmergencyNumbers: () => dispatch(getEmergencyNumbers()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmergencyCall);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor:  Platform.OS === 'ios' ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width: width,
    // opacity: Platform.OS === 'ios' ? 0.85 : 0.8,
  },
  buttons: {
    position: 'absolute',
    bottom: 90,
    opacity: 1,
  },
  card: {
    backgroundColor: '#4BA4CB',
    width: width * 0.6,
    height: height * 0.06,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 20,
    flexDirection: 'row',
  },
  textCard: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
    zIndex: 20,
  },
});
