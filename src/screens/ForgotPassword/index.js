import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  SafeAreaView
} from 'react-native';

import {Spinner} from 'native-base';
import Images from '../../utils/images';
import Constants from '../../utils/constants';
import Styles from '../../utils/styles';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {recoverPassword, requestCreateUser} from '../../redux/modules/auth';
import {rutFormat} from 'rut-helpers';
import t from 'prop-types';
class RequestPasswordMail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dni: '',
      error: false,
      errormsg: '',
      showPassword: true,
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
    };
  }
  scrollview = createRef();
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.scrollview.current.scrollToEnd({animated: true}),
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }
  handleSubmit = async () => {
    const request = await this.props.requestMail({dni: this.state.dni});
    if (!request.error) {
      return this.props.navigation.navigate('ResetPassword', {
        dni: this.state.dni,
      });
    }
    this.setState({error: true, errormsg: request.error});
  };

  render() {
    const {loading, header, body, button, image} = this.props;
    
    return (
      <View style={{flex: 1}}>
        <SafeAreaView>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={Styles.touchbackButton}>
              <Image
                source={Images.back_icon}
                style={Styles.imgBack}
                resizeMode="contain"
              />
              <Text style={Styles.backButtonText}>VOLVER</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        <KeyboardAwareScrollView ref={this.scrollview}>
          <View style={{height: Dimensions.get('window').height}}>
            <View style={styles.viewCenter}>
              <Image
                source={image}
                resizeMode="contain"
                style={styles.imgcenter}
              />
              <View>
                <Text style={styles.textH}>{header}</Text>
                <Text style={styles.textN}>{body}</Text>
              </View>
            </View>
            <View style={styles.form}>
              <View style={[styles.viewInput, {marginTop: 15}]}>
                <Text style={styles.textU}>RUT</Text>
                <TextInput
                  placeholder="11111111-1"
                  placeholderTextColor="grey"
                  keyboardType="default"
                  value={this.state.dni}
                  style={styles.inputText}
                  onChangeText={rut => this.setState({dni: rut})}
                  onBlur={() => this.setState({dni: rutFormat(this.state.dni)})}
                />
              </View>
              <View style={styles.viewError}>
                <Text style={styles.textError}>{this.state.errormsg}</Text>
              </View>

              <View style={[Styles.buttonView, {marginTop: 0}]}>
                <TouchableOpacity
                  underlayColor={Constants.underlayColor}
                  style={Styles.buttonHeiglight}
                  disabled={loading}
                  onPress={this.handleSubmit}>
                  <LinearGradient
                    colors={[Constants.themeColor, Constants.gradientlowColor]}
                    style={Styles.LinearGradientStyle}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 1}}
                    locations={[0, 1]}>
                    <Text style={Styles.buttonText}>
                      {loading ? 'CARGANDO...' : button}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {loading && <Spinner color={Constants.themeColor} />}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

    );
  }
}
RequestPasswordMail.propTypes = {
  loading:t.bool,
  header: t.string,
  body: t.string,
  button: t.string,
  image: t.string,
  requestMail: t.func,
};
const mapStateToForgotPasswordProps = state => ({
  loading: state.auth.loading,
  header: '¿OLVIDASTE TU CONTRASEÑA?',
  body: '¡No te preocupes! recuperarla es fácil, solo debes ingresar tu RUT.',
  button: 'RECUPERAR CONTRASEÑA',
  image: Images.ImgThinking,
});

const mapDispatchToForgotPasswordProps = dispatch => ({
  requestMail: ({dni}) => dispatch(recoverPassword({dni})),
});
export const ForgotPasswordScreen = connect(
  mapStateToForgotPasswordProps,
  mapDispatchToForgotPasswordProps,
)(RequestPasswordMail);

const mapStateToRequestCreateUserProps = state => ({
  loading: state.auth.loading,
  header: '¿NO ESTAS REGISTRADO?',
  body: '¡No te preocupes! registrarte es fácil, solo debes ingresar tu RUT.',
  button: 'REGISTRARSE',
  image: Images.ImgThinking,
});

const mapDispatchToRequestCreateUserProps = dispatch => ({
  requestMail: ({dni}) => dispatch(requestCreateUser({dni})),
});

export const RequestCreateUser = connect(
  mapStateToRequestCreateUserProps,
  mapDispatchToRequestCreateUserProps,
)(RequestPasswordMail);

const mapStateToExpiredInitialPasswordTokenProps = state => ({
  loading: state.auth.loading,
  header: 'VENCIÓ TU INVITACIÓN',
  body: '¡No te preocupes, ingresa tu RUT y te enviaremos otro link a tu correo.',
  button: 'REENVIAR',
  image: Images.ImgClock,
});

export const ExpiredInitialPasswordToken = connect(
  mapStateToExpiredInitialPasswordTokenProps,
  mapDispatchToRequestCreateUserProps,
)(RequestPasswordMail);

const mapStateToExpiredResetPasswordTokenProps = state => ({
  loading: state.auth.loading,
  header: 'VENCIÓ TU INVITACIÓN',
  body: '¡No te preocupes, ingresa tu RUT y te enviaremos otro link a tu correo.',
  button: 'REENVIAR',
  image: Images.ImgClock,
});

export const ExpiredResetPasswordToken = connect(
  mapStateToExpiredResetPasswordTokenProps,
  mapDispatchToForgotPasswordProps,
)(RequestPasswordMail);