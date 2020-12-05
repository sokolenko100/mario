/*
 * File: index.js
 * Project: mariposa
 * File Created: Wednesday, 28th August 2019 10:26:21 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Monday, 18th November 2019 11:55:12 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet, Image, Linking, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  ListItem,
  Text,
  Left,
  Body,
  Right,

} from 'native-base';
import Header from '../../reusable/header';
import {toggleIncognito} from '../../redux/modules/map';
import {logoutAction} from '../../redux/modules/auth';
import Alert from '../../reusable/alert';
import t from 'prop-types';
import packageJson from '../../../package.json';
class MoreOptions extends Component {
  constructor(){
    super();
    this.state = {
      alert: false,
    };

  }
  navigateTo = pageName => {
    this.props.navigation.navigate(pageName);
  };
  toggleAlert = () =>{
    this.setState({alert: !this.state.alert});
  }
  handleLogout = () => {
    this.props.navigation.navigate('validate');
    this.props.logout();
  };
  handleIncognito = () =>{
    this.toggleAlert();
    this.props.toggleIncognito();
    this.navigateTo('home');
  }
  render() {
    // const [alert, setAlert] = useState(false);
    // const toggleAlert = () => setAlert(!alert);
    return (
      <Container>
        <Header title={'MENÚ'} withBack={false} />

        <Content style={{marginTop: 0}}>
          <ListItem
            icon
            style={{marginTop: 20, marginRight: 20}}
            onPress={() => this.navigateTo('profile')}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/profile-menu.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>perfil</Text>
            </Body>
            <Right style={styles.borderBottom}>
              <Image
                source={require('../../../assets/images/arrow-menu-rigth.png')}
                style={styles.iconArrow}
              />
            </Right>
          </ListItem>

          {/* <ListItem icon style={{marginRight: 20}}  onPress={() => this.navigateTo('settings')}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image source={require('../../../assets/images/ajustes-menu.png')} style={styles.iconImage} />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>ajustes</Text>
            </Body>
            <Right style={styles.borderBottom}>
              <Image source={require('../../../assets/images/arrow-menu-rigth.png')} style={styles.iconArrow} />

            </Right>
          </ListItem> */}

          {/* <ListItem icon style={{marginRight: 20}}  onPress={() => this.navigateTo('notifications')}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image source={require('../../../assets/images/notificacion-menu.png')} style={styles.iconImage} />
              <View style={styles.noty}>
                <Text style={styles.notyText}>3</Text>
              </View>
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>notificaciones</Text>
            </Body>
            <Right style={styles.borderBottom}>
              <Image source={require('../../../assets/images/arrow-menu-rigth.png')} style={styles.iconArrow} />

            </Right>
          </ListItem> */}

          <ListItem
            icon
            style={{marginRight: 20}}
            onPress={() => this.navigateTo('faqs')}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/preguntasfrecuentes-menu.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>preguntas frecuentes</Text>
            </Body>
            <Right style={styles.borderBottom}>
              <Image
                source={require('../../../assets/images/arrow-menu-rigth.png')}
                style={styles.iconArrow}
              />
            </Right>
          </ListItem>
          <ListItem
            icon
            style={{marginRight: 20}}
            onPress={() => this.navigateTo('terms')}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/terminosycondiciones-menu.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>términos y condiciones</Text>
            </Body>
            <Right style={styles.borderBottom}>
              <Image
                source={require('../../../assets/images/arrow-menu-rigth.png')}
                style={styles.iconArrow}
              />
            </Right>
          </ListItem>

          <ListItem
            icon
            style={{marginRight: 20}}
            onPress={() =>
              Linking.openURL('https://auto-conectado-qa.azurewebsites.net/auth/login')
            }>
            <Left style={[{paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/metododepago-menu.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={{borderBottomWidth: 0}}>
              <Text style={styles.text}>método de pago</Text>
            </Body>
            <Right style={{borderBottomWidth: 0}}>
              <Image
                source={require('../../../assets/images/arrow-menu-rigth.png')}
                style={styles.iconArrow}
              />
            </Right>
          </ListItem>

          <ListItem itemDivider />

          <ListItem
            icon
            style={{marginRight: 20}}
            onPress={() => {
              this.toggleAlert();
            }}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/incognito-menu.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>modo incógnito</Text>
            </Body>
            {/* <Right style={[styles.borderBottom]}>
              <Image
                source={require('../../../assets/images/arrow-menu-rigth.png')}
                style={styles.iconArrow}
              />
            </Right> */}
          </ListItem>

          <ListItem
            icon
            style={{marginRight: 20}}
            onPress={() => this.handleLogout()}>
            <Left style={[styles.borderBottom, {paddingLeft: 10}]}>
              <Image
                source={require('../../../assets/images/cerrar.png')}
                style={styles.iconImage}
              />
            </Left>
            <Body style={[styles.borderBottom]}>
              <Text style={styles.text}>cerrar sesión</Text>
            </Body>
            <Right style={styles.borderBottom} />
          </ListItem>
        </Content>
        <Text style={styles.version}>Version {packageJson.version}</Text>
        <Alert
          danger
          header="MODO INCÓGNITO"
          body="Tus viajes no quedarán registrados, pero el servicio de E-call sigue activo. ¿Estás seguro de activar Modo Incógnito?"
          actions={[
            {text: 'NO', onPress: this.toggleAlert},
            {text: 'SI', main: true, onPress: this.handleIncognito},
          ]}
          visible={this.state.alert}
          closeModal={this.toggleAlert}
        />
      </Container>
    );
  }
}
MoreOptions.propTypes ={
  logout: t.func,
  toggleIncognito: t.func,
};
const mapDispatchToProps = dispatch => {
  return {
    toggleIncognito: () => dispatch(toggleIncognito()),
    logout: () => dispatch(logoutAction()),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(MoreOptions);

const styles = StyleSheet.create({
  version: { 
    position: 'absolute', 
    bottom: Dimensions.get('screen').height * 0.10, 
    textAlign: 'center', 
    alignSelf: 'center', 
    fontSize: 8
  },
  iconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  iconArrow: {
    width: 7,
    height: 12,
    resizeMode: 'contain',
  },
  text: {
    color: '#475563',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    textTransform: 'uppercase',
  },
  borderBottom: {
    borderBottomColor: '#C8CBD1',
    borderBottomWidth: 0.87,
  },
  noty: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#DC5868',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
    right: 8,
    padding: 0,
  },
  notyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Raleway-Bold',
    marginTop: -3,
  },
});
