/*
 * File: moreOptions.js
 * Project: mariposa
 * File Created: Thursday, 8th August 2019 9:24:32 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 1:15:37 pm
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
} from 'react-native';
import {connect} from 'react-redux';
import {toggleIncognito} from '../redux/modules/map';
const {height, width} = Dimensions.get('window');
class MoreOptions extends Component {
  static propTypes = {
    active: t.bool.isRequired,
    close: t.func,
    toggleIncognito: t.func,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigateTo(pageName) {
    this.props.navigation.navigate(pageName);
  }

  handlePress = (onPress = () => {}) => () => {
    this.props.close();
    onPress();
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            display: this.props.active ? 'flex' : 'none',
            position: this.props.active ? 'absolute' : 'relative',
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
          <TouchableWithoutFeedback
            onPress={this.handlePress(() => this.navigateTo('profile'))}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/profilex.png')}
              />
              <Text style={styles.textCard}>PERFIL</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this.handlePress(() => this.navigateTo('settings'))}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/settings.png')}
              />
              <Text style={styles.textCard}>AJUSTES</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={this.handlePress(() => this.navigateTo('notifications'))}>
            <View style={styles.card}>
              <View>
                <Image
                  style={{
                    width: width * 0.064,
                    height: height * 0.0271,
                    resizeMode: 'contain',
                    marginRight: 5,
                  }}
                  source={require('../../assets/images/notifications.png')}
                />
                <View style={styles.circle} />
              </View>

              <Text style={styles.textCard}>NOTIFICACIONES</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={this.handlePress(() => {
              this.props.toggleIncognito();
              this.navigateTo('home');
            })}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 5,
                }}
                source={require('../../assets/images/incognito-ico.png')}
              />
              <Text style={styles.textCard}>MODO INCÓGNITO</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={this.handlePress(() => this.navigateTo('faqs'))}>
            <View style={styles.card}>
              <Image
                style={{
                  width: width * 0.064,
                  height: height * 0.0271,
                  resizeMode: 'contain',
                  marginRight: 2,
                }}
                source={require('../../assets/images/faq.png')}
              />
              <Text style={styles.textCard}>PREGUNTAS</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleIncognito: () => dispatch(toggleIncognito()),
});

export default connect(
  null,
  mapDispatchToProps,
)(MoreOptions);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: -height,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width: width,
    opacity: Platform.OS === 'ios' ? 0.95 : 0.9,
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    right: 18,
    opacity: 1,
  },
  card: {
    backgroundColor: '#243142',
    width: width * 0.38,
    height: height * 0.07,
    borderRadius: 9,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 20,
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
  },
  textCard: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Raleway-Regular',
    zIndex: 20,
  },
  circle: {
    width: 9,
    height: 9,
    borderRadius: 9 / 2,
    backgroundColor: '#4BA4CB',
    position: 'absolute',
    top: 0,
    right: 6,
  },
});
