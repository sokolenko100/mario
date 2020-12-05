/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 26th July 2019 12:41:29 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Friday, 15th November 2019 12:05:26 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component, useState} from 'react';
import t from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  AppState,
  Dimensions,
  StyleSheet
} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import Images from '../../utils/images';
import Constants from '../../utils/constants';
import Styles from '../../utils/styles';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style.js';
import {Spinner} from 'native-base';
import {loginAction, validateAuthData, validateDni, validatePassword, createUserDni, logoutAction} from '../../redux/modules/auth';
import ModalPaymentMethod from '../../reusable/modalPaymentMethod';
import ModalTerms from '../../reusable/modalTerms';
import {rutFormat, rutValidate} from 'rut-helpers';
import {devlog} from '../../utils/log';
import {toggleApiEnv} from '../../redux/modules/api';
import Button from '../../reusable/button';
import TextInput from '../../reusable/input';
import Fonts from '../../utils/fonts';

const {width} = Dimensions.get('window');

const EnterRutModal = ({ visible, close, sendDni }) => {
  const [dni, setDni] = useState('');
  const [dniError, setDniError] = useState(true);
  const handleWriteDni = (text) => {
    devlog(text, rutValidate(text));
    setDni(text);
    setDniError(!rutValidate(text));
  };
  const sendRut = () => {
    close();
    sendDni({ dni });
  };
  return <Modal
    isVisible={visible}
    backdropColor="#243142"
    backdropOpacity={0.5}>
    <View style={modalStyles.card}>
      <View style={[modalStyles.cardHeader]}>
        <Text style={modalStyles.header}>Bienvenido</Text>
      </View>
      <View style={modalStyles.cardBody}>
        <Text style={modalStyles.body}>
            Ingresa tu RUT para verificar tu suscripción
        </Text>
      
        <Text style={styles.inputTitle}>RUT</Text>
        <TextInput
          name={'RUT'}
          value={dni}
          inputKey={'dni'}
          type={'default'}
          onValueChange={(_, text) => handleWriteDni(text)}
          onFinalValueChange={() => handleWriteDni(rutFormat(dni))}
          align={'left'}
          flex={0}
        />
      </View>

      <View style={modalStyles.cardActions}>
        <Button text="ENVIAR" onPress={sendRut} disabled={dniError}>
        </Button>
      </View>
    </View>
  </Modal>;
};
EnterRutModal.propTypes = {
  visible: t.bool,
  close: t.func,
  sendDni: t.func
};

const NoUserModal = ({ visible, email, dni, close }) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(logoutAction());
    close();
  };
  return <Modal
    isVisible={visible}
    backdropColor="#243142"
    backdropOpacity={0.5}>
    <View style={modalStyles.card}>
      <View style={[modalStyles.cardHeader]}>
        <Text style={modalStyles.header}>Bienvenido</Text>
      </View>
      <View style={modalStyles.cardBody}>
        <Text style={modalStyles.body}>
            No hemos encontrado una suscripción para <Text style={modalStyles.bodyBold}>{email}</Text> con RUT <Text style={modalStyles.bodyBold}>{rutFormat(dni)}</Text>
        </Text>
      </View>
      <View style={modalStyles.cardActions}>
        <Button text="VOLVER" onPress={handleClose}>
        </Button>
      </View>
    </View>
  </Modal>;
};
NoUserModal.propTypes = {
  visible: t.bool,
  email: t.string.isRequired,
  dni: t.string.isRequired,
  close: t.func
};
export class LoginScreen extends Component {
  static propTypes = {
    data: t.shape({
      tokens: t.object,
      uuid: t.string,
    }).isRequired,
    loading: t.bool,
    error: t.string,
    login: t.func.isRequired,
    toggleApiEnv: t.func,
    api: t.string,
    validateDni: t.func,
    validatePassword: t.func,
    createUserDni: t.func,
    email: t.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      dni: '',
      password: '',
      appState: AppState.currentState,
      enterRut: false
    };
  }
  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      this.props.data &&
      this.props.data.uuid
    ) {
      this.props.navigation.navigate('validate');
    }
    this.setState({appState: nextAppState});
  };
  login = async () => {
    const {login, navigation} = this.props;
    const {tyc, existUser } = await login();
    if (!existUser) {
      this.setState({ enterRut: true });
      return;
    }
    if (tyc) {
      navigation.navigate('app');
    }
  };
  handleSendDni = async ({ dni }) => {
    const success = await this.props.createUserDni({ dni });
    if (success) {
      return this.login();
    }
    this.setState({ noUserFound: true, dni });
  }
  render() {
    const {loading, email} = this.props;
    const {dni, enterRut, noUserFound} = this.state;
    return (
      <View style={{flex: 1}} testID="loginScreen">
        {loading && <View style={styles.loadingOverlay}><Spinner color='#fff' size="large"/></View>}
        <Image
          source={Images.ImgCircleTop}
          resizeMode="contain"
          style={Styles.topCornerImage}
        />
        <Image
          source={Images.ImgCircleLeft}
          resizeMode="contain"
          style={Styles.bottomLeftImage}
        />
        <View style={Styles.container}>
          <Image
            source={Images.ImgLogo}
            resizeMode="contain"
            style={styles.img}
          />
          <TouchableOpacity
            style={Styles.buttonHeiglight}
            disabled={loading}
            onPress={() => {
              this.login();
            }}
            testID="submitLogin">
            <LinearGradient
              colors={[Constants.themeColor, Constants.gradientlowColor]}
              style={Styles.LinearGradientStyle}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 1}}
              locations={[0, 1]}>
              <Text style={Styles.buttonText}>
                {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <ModalTerms />
        <ModalPaymentMethod />
        <EnterRutModal visible={enterRut} close={() => this.setState({ enterRut: false })} sendDni={this.handleSendDni}/>
        <NoUserModal visible={noUserFound} email={email} dni={dni} close={() => this.setState({ noUserFound: false })}/>
      </View>
    );
  }
}

const mapStateToProps = ({
  auth: {data, error, ...auth},
  api,
  paymentMethod,
  cars,
}) => ({
  loading: auth.loading || paymentMethod.loading || cars.loading,
  data,
  error,
  api,
  email: data.email
});
const mapDispatchToProps = dispatch => ({
  login: () => dispatch(loginAction()),
  toggleApiEnv: () => dispatch(toggleApiEnv()),
  validate: ({dni, password}) => dispatch(validateAuthData({dni, password})),
  validateDni: dni => dispatch(validateDni(dni)),
  validatePassword: password => dispatch(validatePassword(password)),
  createUserDni: ({ dni }) => dispatch(createUserDni({ dni }))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);


const modalStyles = StyleSheet.create({
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
    marginHorizontal: 20,
  },
  body: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 20,
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
    justifyContent: 'center',
    width: '100%',
    marginBottom: 25,
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
  input: {
    width: width * 0.88,
  },
  inputTitle: {
    textTransform: 'uppercase',
    color: '#475563',
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    marginBottom: 4,
  },
  textError: {
    color: Constants.errorColor,
    fontSize: 10,
    fontFamily: Fonts.Raleway_Bold,
  },
  viewError: {
    width: '100%',
    height: 40,
    textAlign: 'left',
    justifyContent: 'center',
  },
});