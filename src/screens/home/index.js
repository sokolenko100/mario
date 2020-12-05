/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 5th July 2019 4:45:07 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 11:58:18 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component, createRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  PermissionsAndroid,
  BackHandler,
  AppState
} from 'react-native';
import {connect} from 'react-redux';
import {View as AnimatedView} from 'react-native-animatable';
import {Content, Container} from 'native-base';
import {withNavigationFocus} from 'react-navigation';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import CarInformation from '../../reusable/carInformation';
import BottomDrawer from './bottomDrawer';
import Constants from '../../utils/constants';
import {getCurrentLocation, selectCar} from '../../redux/modules/map';
import IncognitoMode from './IncognitoMode';
import ModalTerms from '../../reusable/modalTerms';
import ModalPaymentMethod from '../../reusable/modalPaymentMethod';
import {getCarsInfo} from '../../redux/modules/cars';
import {getCarImage} from '../../../assets/images/colores_autos';
import {devlog} from '../../utils/log';
import Alert from '../../reusable/alert';
import Geolocation from '@react-native-community/geolocation';
import t from 'prop-types';
import { requestPaymentMethod } from '../../redux/modules/paymentMethod';
const {height, width} = Dimensions.get('window');
const NORMAL_MODE_TIMEOUT = 50000;

const getRotation = orientation => {
  const DATA = {
    'N': 0,
    'N-WN': 292.5,
    'NW': 270,
    'W-NW': 247.5,
    'W': 225,
    'W-SW': 202.5,
    'WS': 180,
    'S-SW': 157.5,
    'S': 135,
    'S-SE': 112.5,
    'SE': 90,
    'E-SE': 67.5,
    'E': 45,
    'E-NE': 22.5,
    'NE': 0,
    'N-NE': 337.5
    
  };
  return DATA[orientation] || DATA.N;
};

const SelectedCircle = ({children, selected}) => {
  if (!selected) {
    return children;
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
      <AnimatedView
        animation={{from: {scale: 0.8}, to: {scale: 1}}}
        duration={3000}
        useNativeDriver
        iterationCount="infinite"
        direction="alternate"
        easing="ease-out">
        <View
          style={{
            width: 113,
            height: 113,
            borderRadius: 113 / 2,
            backgroundColor: 'rgba(106,129,191,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 91,
              height: 91,
              borderRadius: 91 / 2,
              backgroundColor: 'rgba(106,129,191,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 64 / 2,
                backgroundColor: 'rgba(106,129,191,0.79)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        </View>
      </AnimatedView>
      <View style={{position: 'absolute'}}>{children}</View>
    </View>
  );
};

SelectedCircle.propTypes = {
  children: t.any,
  selected: t.any,
};
class Home extends Component {
  interval = null;
  mapRef = createRef();
  state = {
    exitModal: false,
    granted: Platform.OS === 'ios',
    currentAppState: AppState.currentState
  };
  backListener = {remove() {}};
  async componentDidMount() {
    const { getCurrentLocation} = this.props;
    this.props.requestPaymentMethod();
    getCurrentLocation();
    this.setIntervals();
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permisos de ubicación',
          message:
            'MiAuto necesita acceder a tu ubicación para poder mostrarla en el mapa',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED){
        this.setState({granted: true});
      }
    }
    this.registerBackListener();
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    // remove intervals on unmount
    this.clearIntervals();
  }

  // remove intervals on background and set on active
  _handleAppStateChange = nextAppState => {
    if (this.state.currentAppState.match(/inactive|background/) &&
      nextAppState === 'active') {
      this.setIntervals();
    }
    if (this.state.currentAppState.match(/active/) && nextAppState.match(/inactive|background/)) {
      this.clearIntervals();
    }
    this.setState({ currentAppState: nextAppState });
  };
  registerBackListener = () => {
    this.backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (
          this.props.isFocused &&
          !this.state.exitModal &&
          !this.props.emergencyMenuShow
        ) {
          this.setState({exitModal: true});
          return true;
        } else {
          this.props.navigation.navigate('home');
        }
      },
    );
  };

  closeExitModal = () => {
    this.setState({exitModal: false});
  };
  clearIntervals = () => {
    if (this.interval) {
      clearInterval(this.interval);
      devlog('CLEAR INTERVAL POSITION');
    }
    if (this.carInfoInterval) {
      devlog('CLEAR INTERVAL CAR');
      clearInterval(this.carInfoInterval);
    }
  }
  setIntervals = () => {
    this.clearIntervals();
    this.interval = setInterval(this.handleUpdate, NORMAL_MODE_TIMEOUT);
    this.carInfoInterval = setInterval(this.props.getCarsInfo, 60 * 1000);
  };

  async componentDidUpdate({
    followMode: prevFollowMode,
    selectedCar: prevSelectedCar,
    isFocused: prevFocused,
  }) {
    const {followMode, selectedCar, isFocused} = this.props;
    if (followMode !== prevFollowMode) {
      this.setIntervals();
    }
    if (
      selectedCar.latitude !== prevSelectedCar.latitude ||
      selectedCar.longitude !== prevSelectedCar.longitude
    ) {
      if (
        (!selectedCar.latitude || !selectedCar.longitude) && this.state.granted
      ) {
        Geolocation.getCurrentPosition(
          async ({coords: {latitude, longitude}}) => {
            const changeCamera =
              selectedCar.incognito || prevSelectedCar.incognito
                ? 'setCamera'
                : 'animateCamera';
            this.mapRef.current[changeCamera](
              {
                ...(await this.mapRef.current.getCamera()),
                center: {latitude, longitude},
              },
              {duration: 300},
            );
          },
        );
      } else {
        const changeCamera =
          selectedCar.incognito || prevSelectedCar.incognito
            ? 'setCamera'
            : 'animateCamera';
        this.mapRef.current[changeCamera](
          {...(await this.mapRef.current.getCamera()), center: selectedCar},
          {duration: 300},
        );
      }
    }
    if (prevFocused !== isFocused) {
      if (isFocused) {
        this.setIntervals();
      } else {
        // remove intervals on unfocus (change screen inside app)
        this.clearIntervals();
      }
    }
  }

  handleUpdate = () => {
    const {getCurrentLocation} = this.props;
    getCurrentLocation();
  };

  render() {
    const {selectedCar, cars, selected} = this.props;
    const {latitude = -33.37200676, longitude = -70.70883946} = selectedCar;
    const location = {
      latitude,
      longitude,
      latitudeDelta: selectedCar.latitude ? 0.008 : 0.06155,
      longitudeDelta: selectedCar.longitude ? 0.008 : 0.03836,
    };
    const markers = cars;
    return (
      <Container testID="homeScreen">
        <CarInformation
          update={this.handleUpdate}
          marginTop={Platform.OS === 'ios' ? 35 : 0}
        />
        <IncognitoMode />
        <Content>
          <View style={styles.container}>
            <MapView
              ref={this.mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              // onMapReady={message => console.log(message)}
              loadingEnabled={true}
              showsUserLocation={true}
              followsUserLocation={true}
              initialRegion={location}
              customMapStyle={Constants.mapStyle}
              showsMyLocationButton={false}
              rotateEnabled={false}>
              {markers.map((marker, index) => {
                const isSelected = marker.subscriptionId === selected;
                return (
                  <Marker
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    key={index}
                    opacity={isSelected ? 1 : 0.5}
                    onPress={() => this.props.selectCar(marker.subscriptionId)}
                    anchor={{x: 0.5, y: 0.5}}>
                    <View
                      style={{
                        width: 113,
                        height: 113,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <SelectedCircle selected={selected}>
                        <Image
                          style={[
                            isSelected
                              ? styles.activeImageCar
                              : styles.imageCar,
                            {transform: [{rotate: `${marker.rotation}deg`}]},
                          ]}
                          source={
                            isSelected
                              ? getCarImage(marker.colour)
                              : require('../../../assets/images/colores_autos/gray.png')
                          }
                        />
                      </SelectedCircle>
                    </View>
                  </Marker>
                );
              })}
            </MapView>
          </View>
        </Content>
        <BottomDrawer />
        <ModalTerms />
        <ModalPaymentMethod />
        <Alert
          header="SALIR"
          body="¿Quieres salir de la aplicación?"
          actions={[
            {text: 'SALIR', onPress: () => BackHandler.exitApp()},
            {text: 'CANCELAR', main: true, onPress: this.closeExitModal},
          ]}
          closeModal={this.closeExitModal}
          visible={this.state.exitModal}
          danger
        />
        {/* <NoConnection></NoConnection> */}
      </Container>
    );
  }
}

Home.propTypes = {
  cars: t.array,
  selectedCar: t.object,
  selectCar: t.function,
  followMode: t.bool,
  selected: t.bool,
  emergencyMenuShow: t.bool,
  getCurrentLocation: t.func,
  getCarsInfo: t.func,
  isFocused: t.bool,
  requestPaymentMethod: t.func,
};

const mapStateToProps = ({
  localState: {followMode, emergencyMenuShow},
  map: {data, selected, incognitoIds = []},
  cars: {data: carsInfo},
}) => {
  const {latitude, longitude} = data[selected] || {};
  return {
    cars: Object.values(data)
      .filter(car => {
        return !incognitoIds.includes(car.id) && car.latitude && car.longitude;
      })
      .map(car => ({
        ...car,
        rotation: getRotation(car.heading),
      }))
      .map(car => ({
        ...carsInfo[car.subscriptionId],
        ...car,
      })),
    selectedCar: {
      latitude,
      longitude,
      incognito: incognitoIds.includes(selected),
    },
    followMode,
    selected,
    emergencyMenuShow,
  };
};
const mapDispatchToProps = dispatch => ({
  getCurrentLocation: () => dispatch(getCurrentLocation()),
  selectCar: id => dispatch(selectCar(id)),
  getCarsInfo: () => dispatch(getCarsInfo()),
  requestPaymentMethod: () => dispatch(requestPaymentMethod())
});

export default withNavigationFocus(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Home),
);

const styles = StyleSheet.create({
  container: {flex: 1, height: height * 1},
  map: {flex: 1},
  imageCar: {
    width: width * 0.11,
    maxHeight: 113,
    resizeMode: 'contain',
  },
  activeImageCar: {
    width: 50,
    maxHeight: 113,
    resizeMode: 'contain',
  },
  currentCar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
