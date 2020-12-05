/*
 * File: footer.js
 * Project: mariposa
 * File Created: Wednesday, 3rd July 2019 3:24:00 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:08:04 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {PureComponent} from 'react';
import t from 'prop-types';

import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {Text} from 'native-base';
import EmergencyCall from './emergencyCall';
import {
  showEmergencyMenu,
  hideEmergencyMenu,
  showMoreOptionsMenu,
  hideMoreOptionsMenu,
} from '../redux/modules/localState';
const {width, height} = Dimensions.get('window');
class FooterMenu extends PureComponent {
  static propTypes = {
    navigation: t.object.isRequired,
    hideEmergencyMenu: t.func.isRequired,
    showEmergencyMenu: t.func.isRequired,
    emergencyMenu: t.bool.isRequired,
    terms: t.bool,
    hideMoreOptionMenu: t.func,
  };

  navigateTo = pageName => {
    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      this.closeMenus();
      this.props.navigation.navigate(pageName);
    });
  };
  closeMenus = () => {
    this.props.hideEmergencyMenu();
    this.props.hideMoreOptionMenu();
  };

  // emergency(){
  //   if(Platform.OS === 'ios'){

  //   }
  //   return
  // }

  render() {
    const {
      emergencyMenu,
      hideEmergencyMenu,
      showEmergencyMenu,
      navigation,
      terms,
    } = this.props;
    if (terms) {
      return null;
    }
    // eslint-disable-next-line no-unused-vars
    let emergencyIOS;
    // eslint-disable-next-line no-unused-vars
    let emergencyAndroid;
    const [isHome, isService, isRecords, isMore] = [
      'home',
      'services',
      'records',
      'moreOptions',
    ].map((path, i) => i === navigation.state.index);
    if (Platform.OS === 'ios') {
      emergencyIOS = (
        <Image
          source={require('../../assets/images/iconos/asistencia.png')}
          style={{width: 58, height: 54}}
        />
      );
    } else {
      emergencyAndroid = (
        <TouchableWithoutFeedback
          onPress={() => {
            emergencyMenu ? hideEmergencyMenu() : showEmergencyMenu();
          }}
          active>
          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              elevation: 4,
              bottom: 27,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              shadowColor: 'transparent',
              shadowOpacity: 0,
            }}>
            <Image
              source={require('../../assets/images/iconos/asistencia.png')}
              style={{
                width: 58,
                height: 54,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <>
        <EmergencyCall active={emergencyMenu} close={hideEmergencyMenu} />
        <View style={styles.footer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.navigateTo('home');
            }}>
            <View
              style={{
                alignItems: 'center',
                width: 43,
                height: 50,
                justifyContent: 'center',
              }}>
              <Image
                source={
                  isHome
                    ? require('../../assets/images/iconos/inicio.png')
                    : require('../../assets/images/iconos/inicio_inactivo.png')
                }
                style={styles.menuImage}
              />
              {isHome && <Text style={styles.textMenu}>inicio</Text>}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.navigateTo('records');
            }}>
            <View
              style={{
                alignItems: 'center',
                width: 53,
                height: 50,
                justifyContent: 'center',
              }}>
              <Image
                source={
                  isRecords
                    ? require('../../assets/images/iconos/historial_activo.png')
                    : require('../../assets/images/iconos/historial_inactivo.png')
                }
                style={styles.menuImage}
              />
              {isRecords && <Text style={styles.textMenu}>historial</Text>}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              emergencyMenu ? hideEmergencyMenu() : showEmergencyMenu();
            }}>
            <View>
              <Image
                source={require('../../assets/images/iconos/asistencia.png')}
                style={styles.asistentImage}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              this.navigateTo('services');
            }}>
            <View
              style={{
                alignItems: 'center',
                width: 43,
                height: 50,
                justifyContent: 'center',
              }}>
              <Image
                source={
                  isService
                    ? require('../../assets/images/iconos/auto_activo.png')
                    : require('../../assets/images/iconos/auto_inactivo.png')
                }
                style={styles.menuImage}
              />
              {isService && <Text style={styles.textMenu}>mi auto</Text>}
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.navigateTo('moreOptions');
            }}>
            <View
              style={{
                alignItems: 'center',
                width: 43,
                height: 50,
                justifyContent: 'center',
              }}>
              <Image
                source={
                  isMore
                    ? require('../../assets/images/iconos/mas_activo.png')
                    : require('../../assets/images/iconos/mas_inactivo.png')
                }
                style={styles.menuImage}
              />
              {isMore && <Text style={styles.textMenu}>menú</Text>}
              {/* <View style={styles.noty}>
                <Text style={styles.notyText}>3</Text>
              </View> */}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </>

    // <SafeAreaView style={{backgroundColor: '#243142'}}>

    // <View>
    //   {emergencyAndroid}
    //   <View>
    //     <EmergencyCall active={emergencyMenu} close={hideEmergencyMenu} />
    //     <MoreOptions
    //       active={moreOptionMenu}
    //       close={this.closeMenus}
    //       navigation={this.props.navigation}
    //     ></MoreOptions>
    //   </View>
    //   <Footer>
    //     <FooterTab style={styles.footer}>
    //       <Button
    //         vertical
    //         onPress={() => {
    //           this.navigateTo('home');
    //         }}
    //       >
    //         <Image
    //           source={
    //             isHome
    //               ? require('../../assets/images/inicio_activo.png')
    //               : require('../../assets/images/inicio.png')
    //           }
    //           style={{ width: 22, height: 17 }}
    //         />
    //         <Text
    //           numberOfLines={1}
    //           style={[
    //             styles.textMenu,
    //             {
    //               color: isHome ? '#FFFFFF' : '#717A84',
    //               fontFamily: isHome ? 'Raleway-Bold' : 'Raleway-Regular'
    //             }
    //           ]}
    //         >
    //             Inicio
    //         </Text>
    //       </Button>
    //       <Button
    //         vertical
    //         onPress={() => {
    //           this.navigateTo('services');
    //         }}
    //       >
    //         <Image
    //           source={
    //             isService
    //               ? require('../../assets/images/servicios_activo.png')
    //               : require('../../assets/images/servicios.png')
    //           }
    //           style={{ width: 18, height: 17 }}
    //         />
    //         <Text
    //           numberOfLines={1}
    //           style={[
    //             styles.textMenu,
    //             {
    //               color: isService ? '#FFFFFF' : '#717A84',
    //               fontFamily: isService ? 'Raleway-Bold' : 'Raleway-Regular'
    //             }
    //           ]}
    //         >
    //             Servicios
    //         </Text>
    //       </Button>
    //       <Button
    //         vertical
    //         style={styles.emergencyButton}
    //         onPress={() => {
    //           emergencyMenu ? hideEmergencyMenu() : showEmergencyMenu();
    //         }}
    //       >
    //         {emergencyIOS}
    //       </Button>

    //       <Button
    //         vertical
    //         onPress={() => {
    //           this.navigateTo('records');
    //         }}
    //       >
    //         <Image
    //           source={
    //             isRecords
    //               ? require('../../assets/images/historial_activo.png')
    //               : require('../../assets/images/historial.png')
    //           }
    //           style={{
    //             width: 15,
    //             height: 16
    //           }}
    //         />
    //         <Text
    //           numberOfLines={1}
    //           style={[
    //             styles.textMenu,
    //             {
    //               color: isRecords ? '#FFFFFF' : '#717A84',
    //               fontFamily: isRecords ? 'Raleway-Bold' : 'Raleway-Regular'
    //             }
    //           ]}
    //         >
    //             Historial
    //         </Text>
    //       </Button>
    //       <Button
    //         vertical
    //         onPress={() => {
    //           this.navigateTo('moreOptions');
    //         }}
    //       >
    //         <Image
    //           source={
    //             isProfile
    //               ? require('../../assets/images/ajustes_activo.png')
    //               : require('../../assets/images/ajustes.png')
    //           }
    //           style={{ width: 20, height: 5 }}
    //         />
    //         <Text
    //           numberOfLines={1}
    //           style={[
    //             styles.textMenu,
    //             {
    //               color: isProfile ? '#FFFFFF' : '#717A84',
    //               fontFamily: isProfile ? 'Raleway-Bold' : 'Raleway-Regular',
    //               marginTop: 8,
    //               justifyContent: 'flex-end'
    //             }
    //           ]}
    //         >
    //             Más
    //         </Text>
    //       </Button>
    //     </FooterTab>
    //   </Footer>
    // </View>
    // </SafeAreaView>
    );
  }
}

const mapStateToProps = ({
  localState: {emergencyMenuShow, moreOptionShow, terms},
  auth: {
    data: {tyc},
  },
}) => ({
  emergencyMenu: emergencyMenuShow,
  moreOptionMenu: moreOptionShow,
  terms: terms && !tyc,
});

const mapDispatchToProps = dispatch => ({
  showEmergencyMenu: () => dispatch(showEmergencyMenu()),
  hideEmergencyMenu: () => dispatch(hideEmergencyMenu()),
  showMoreOptionMenu: () => dispatch(showMoreOptionsMenu()),
  hideMoreOptionMenu: () => dispatch(hideMoreOptionsMenu()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FooterMenu);

const styles = StyleSheet.create({
  footer: {
    width: width * 0.96,
    height: height * 0.08,
    left: width * 0.02,
    backgroundColor: '#243142',
    position: 'absolute',
    bottom: 14,
    paddingVertical: 7,
    paddingHorizontal: 29,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuImage: {
    maxWidth: width * 0.07,
    maxHeight: height * 0.03,
    resizeMode: 'contain',
  },
  asistentImage: {
    maxWidth: width * 0.11,
    maxHeight: height * 0.11,
    resizeMode: 'contain',
  },
  textMenu: {
    color: 'white',
    fontFamily: 'Raleway-Bold',
    fontSize: 10,
    marginTop: 4,
    paddingLeft: 0,
    paddingRight: 0,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  noty: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#DC5868',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: -9,
    right: -6,
    padding: 0,
  },
  notyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Raleway-Bold',
    marginTop: -3,
  },
  emergencyButton:
    Platform.OS === 'ios'
      ? {
        // marginTop: - 54,
        backgroundColor: 'transparent',
        width: 116,
        height: 70,
        paddingBottom: 60,
        // resizeMode: 'contain'
      }
      : {
        backgroundColor: 'transparent',
        width: 116,
        height: 55,
        flex: 1,
      },
});
