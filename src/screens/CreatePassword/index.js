/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 26th July 2019 12:41:29 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 1:12:49 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component, createRef} from 'react';
import t from 'prop-types';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import Images from '../../utils/images';
import Constants from '../../utils/constants';
import Styles from '../../utils/styles';
import styles from './style.js';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Spinner, Toast} from 'native-base';
import {createPassword, createUser, validateNewUserToken, validatePasswordToken} from '../../redux/modules/auth';
import Button from '../../reusable/button';
import {rutFormat} from 'rut-helpers';
class CreatePassword extends Component {
  static propTypes = {
    data: t.shape({
      tokens: t.object,
    }).isRequired,
    loading: t.bool.isRequired,
    error: t.string,
    login: t.func.isRequired,
    createPassword: t.func,
    token: t.string,
    validateToken: t.func,
    invalidScreen: t.string,
    type: t.string,
  };
  passwordInput = createRef();
  passwordRInput = createRef();
  scrollview = createRef();
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      showRPassword: false,
      dni: '',
      password: '',
      rPassword: '',
    };
  }
  createPassword = async () => {
    const {createPassword, navigation} = this.props;
    try {
      await createPassword(this.state);
      Toast.show({
        text: 'Clave actualizada correctamente',
        buttonText: '',
        duration: 1500,
        type: 'success',
        position: 'top',
      });
      navigation.navigate('login');
    } catch (e) {
      // TODO adjust for cases of expired/wrong token vs already used (password already set)
      navigation.navigate('ExpiredInitialPasswordToken');
    }
  };
  componentDidMount() {
    const {token, navigation} = this.props;
    this.validateToken();
    if (token === '') {
      navigation.navigate('login');
    }
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.scrollview.current.scrollToEnd({animated: true});
      },
    );
  }
  validateToken = async () => {
    const {validateToken, navigation: {navigate}, invalidScreen } = this.props;
    const valid = await validateToken();
    if (!valid) {
      navigate(invalidScreen);
    }
  }
  componentDidUpdate() {
    const {data} = this.props;
    if (data.tokens) {
      this.props.navigation.navigate('app');
    }
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }
  render() {
    const {loading, error, type} = this.props;
    return (
      <View style={{flex: 1}} testID="createPasswordScreen">
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
        <KeyboardAwareScrollView
          ref={this.scrollview}
          keyboardOpeningTime={1000}>
          <View style={styles.viewImage}>
            <Image
              source={Images.ImgLogo}
              resizeMode="contain"
              style={styles.img}
            />
            <Text style={styles.textH}>CREAR CONTRASEÑA</Text>
          </View>
          <View style={styles.form}>
            {type === 'create' ? (
              <View style={[styles.viewContainer, {marginBottom: 25}]}>
                <Text style={styles.textU}>RUT</Text>
                <TextInput
                  style={styles.inputText}
                  keyboardShouldPersistTaps="never"
                  placeholder="Escribe tu RUT"
                  placeholderTextColor="#BCC1C6"
                  value={this.state.dni}
                  onChangeText={dni => this.setState({dni})}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.passwordInput.current.focus();
                  }}
                  blurOnSubmit={false}
                  onBlur={() => this.setState({dni: rutFormat(this.state.dni)})}
                />
              </View>
            ) : null}
            <View style={styles.viewContainer}>
              <Text style={styles.textU}>NUEVA CONTRASEÑA</Text>
              <TextInput
                style={styles.inputText}
                keyboardShouldPersistTaps="never"
                placeholder="Escribe tu contraseña"
                placeholderTextColor="#BCC1C6"
                value={this.state.password}
                secureTextEntry={!this.state.showPassword}
                onChangeText={password => this.setState({password})}
                returnKeyType={'next'}
                ref={this.passwordInput}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  this.passwordRInput.current.focus();
                }}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                style={styles.touchshow}
                onPress={() => {
                  this.setState({showPassword: !this.state.showPassword});
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Images.ImgPassword}
                    style={{width: 13, height: 9}}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.viewContainer, {marginTop: 30}]}>
              <Text style={[styles.textU]}>REPETIR CONTRASEÑA</Text>
              <TextInput
                style={styles.inputText}
                keyboardShouldPersistTaps="never"
                placeholder="Repite tu contraseña"
                placeholderTextColor="#BCC1C6"
                secureTextEntry={!this.state.showRPassword}
                value={this.state.rPassword}
                onChangeText={rPassword => this.setState({rPassword})}
                returnKeyType="done"
                onSubmitEditing={() => this.createPassword()}
                ref={this.passwordRInput}
                autoCapitalize="none"
                testID="passwordInput"
              />

              <TouchableOpacity
                style={styles.touchshow}
                onPress={() => {
                  this.setState({showRPassword: !this.state.showRPassword});
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Images.ImgPassword}
                    style={{width: 13, height: 9}}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            {error ? (
              <View style={styles.viewError}>
                <Text style={styles.textError}>{error}</Text>
              </View>
            ) : null}

            <View style={[Styles.buttonView]}>
              <Button
                text={'ENVIAR CONTRASEÑA'}
                onPress={this.createPassword}
              />
              {loading && <Spinner color={Constants.themeColor} />}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


const mapStateToRecoverPasswordProps = (
  {auth: {loading, data, error}},
  {navigation},
) => ({
  type: 'reset',
  loading,
  data,
  error,
  token: navigation.getParam('acpasstoken', ''),
  invalidScreen: 'ExpiredResetPasswordToken'
});
const mapDispatchToRecoverPasswordProps = (dispatch, ownProps) => ({
  createPassword: state => {
    const {rPassword, password} = state;
    const acpasstoken = ownProps.navigation.getParam('acpasstoken');
    return dispatch(createPassword({rPassword, password, acpasstoken}));
  },
  validateToken: () => {
    const token = ownProps.navigation.getParam('acpasstoken');
    return dispatch(validatePasswordToken({ token }));
  }
});

export const RecoverPassword = connect(
  mapStateToRecoverPasswordProps,
  mapDispatchToRecoverPasswordProps,
)(CreatePassword);

const mapStateToCreateUserPasswordProps = (
  {auth: {loading, data, error}},
  {navigation},
) => ({
  type: 'create',
  loading,
  data,
  error,
  token: navigation.getParam('acnewusertoken', ''),
  invalidScreen: 'ExpiredInitialPasswordToken'
});
const mapDispatchToCreateUserPasswordProps = (dispatch, ownProps) => ({
  createPassword: state => {
    const {dni, rPassword, password} = state;
    const token = ownProps.navigation.getParam('acnewusertoken');
    return dispatch(createUser({dni, rPassword, password, token}));
  },
  validateToken: () => {
    const token = ownProps.navigation.getParam('acnewusertoken');
    return dispatch(validateNewUserToken({ token }));
  }
});

export const CreateUserPassword = connect(
  mapStateToCreateUserPasswordProps,
  mapDispatchToCreateUserPasswordProps,
)(CreatePassword);
