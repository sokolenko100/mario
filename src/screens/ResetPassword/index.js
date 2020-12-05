import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Images from '../../utils/images';
import Constants from '../../utils/constants';
import Styles from '../../utils/styles';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style.js';

export default class ResetPasswordScreen extends Component {

  render() {
    return (
      <View>
        <TouchableOpacity
          // style={Styles.touchbackButton}
          onPress={() => this.props.navigation.goBack()}>
          <View style={Styles.touchbackButton}>
            <Image
              source={Images.back_icon}
              style={Styles.imgBack}
              resizeMode="contain"
            />
            <Text style={Styles.backButtonText}>VOLVER</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.viewImage}>
          <Image
            source={Images.ImgMailSent}
            resizeMode="contain"
            style={styles.imgcenter}
          />
          <View>
            <Text style={styles.textH}>¿Y AHORA QUÉ?</Text>
            <Text style={styles.textN}>
              Hemos enviado a tu correo electrónico un link, sigue las
              instrucciones y recupera tu contraseña.
            </Text>
          </View>
          <View style={[Styles.buttonView, {marginTop: 120}]}>
            <TouchableOpacity
              underlayColor={Constants.underlayColor}
              style={Styles.buttonHeiglight}
              onPress={() => this.props.navigation.navigate('Login')}>
              <LinearGradient
                colors={[Constants.themeColor, Constants.gradientlowColor]}
                style={Styles.LinearGradientStyle}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                locations={[0, 1]}>
                <Text style={Styles.buttonText}>FINALIZAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
