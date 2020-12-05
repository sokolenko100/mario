import React, {Component} from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';
import Swiper from 'react-native-swiper';
import Images from '../../utils/images';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../utils/constants';
import Styles from '../../utils/styles';
import styles from './style.js';

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrWidth: Dimensions.get('window').width,
      scrHeight: Dimensions.get('window').height,
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
        <View style={{flex: 6}}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            loop={false}
            dotColor={Constants.dotNormalColor}
            activeDotColor={Constants.dotSelecetedColor}>
            <View style={styles.slide}>
              <Image style={styles.imgcenter} source={Images.client_avatar} />
              <Text style={styles.textH}>SOY CLIENTE</Text>
              <Text style={styles.textN}>
                Tengo mi cuenta y contrasena para{'\n'} ingresar la aplicacion{' '}
              </Text>
            </View>
            <View style={styles.slide}>
              <Image style={styles.imgcenter} source={Images.guess_avatar} />
              <Text style={styles.textH}>SOY INVITADO</Text>
              <Text style={styles.textN}>
                Tengo mi cuenta y contrasena para{'\n'} ingresar la aplicacion{' '}
              </Text>
            </View>
          </Swiper>
        </View>

        <View style={[{flex: 2}, Styles.buttonView]}>
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
              <Text style={Styles.buttonText}>INGRESAR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
