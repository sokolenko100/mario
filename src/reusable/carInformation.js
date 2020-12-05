/**
 * File: carInformation.js
 * Project: mariposa
 * File Created: Tuesday, 9th July 2019 10:26:57 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 12:29:07 pm
 * Modified By: Hector Piñero (hector@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, { PureComponent, createRef } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { selectCar } from '../redux/modules/map';
import CountDown from './countdown';
import { addHours, differenceInSeconds } from 'date-fns';
import Button from './button';
import { enableCar } from '../redux/modules/cars';
import t from 'prop-types';
class CarInformation extends PureComponent {
  constructor(props) {
    super(props);
  }

  carouselRef = createRef();
  componentDidUpdate(prevProps) {
    const { selectedIndex, shouldSelectFirst, cars } = this.props;
    if (prevProps.selectedIndex !== selectedIndex && selectedIndex !== null) {
      this.carouselRef.current.snapToItem(selectedIndex, true, true);
    }
    if (shouldSelectFirst) {
      this.props.selectCar(cars[0].subscriptionId);
    }
  }

  _renderItem = ({ item }) => {
    const {
      activated,
      enabled,
      dateSentActivated,
      model,
      subscriptionId,
      make,
      cancelled
    } = item;
    const { enableCar } = this.props;
    const activeSubscription = () => enableCar({ subscriptionId });
    if (activated) {
      const brandsLogos = {
        haval: require('../../assets/images/logos_marcas/haval.png'),
        jac: require('../../assets/images/logos_marcas/jac.png'),
        renault: require('../../assets/images/logos_marcas/renault.png'),
        suzuki: require('../../assets/images/logos_marcas/suzuki.png'),
        greatwall: require('../../assets/images/logos_marcas/greatwall.png'),
        mazda: require('../../assets/images/logos_marcas/mazda.png'),
        changan: require('../../assets/images/logos_marcas/changan.png'),
      };
      const brandLogo = brandsLogos[make.toLowerCase()]
        ? brandsLogos[make.toLowerCase()]
        : require('../../assets/images/logos_marcas/logo_dercomaq.png');
      return (
        <TouchableWithoutFeedback onPress={this.props.update}>
          <View style={{ margin: 5 }}>
            <View
              style={{ ...styles.background, marginTop: this.props.marginTop }}>
              <View
                style={[
                  styles.info,
                  this.props.address === null && { borderBottomWidth: 0 },
                ]}>
                <View style={styles.logoContainer}>
                  <Image source={brandLogo} style={styles.carImage} />
                  <Text style={styles.plateText}>{item.plateNumber}</Text>
                </View>
                <View style={{ width: '100%' }}>
                  <Text style={styles.carName}>{item.model}</Text>
                  {item.address !== null && (
                    <View style={styles.status}>
                      <Text style={styles.lastAddress}>ÚLTIMO REGISTRO</Text>
                      <Text style={styles.statusText}>
                        {item.address
                          ? item.address.length > 63
                            ? item.address.slice(0, 60) + '...'
                            : item.address
                          : 'Cargando...'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={this.props.update}>
          <View style={{ margin: 5 }}>
            <View
              style={{ ...styles.background, marginTop: this.props.marginTop }}>
              {!enabled && !dateSentActivated ? (
                <View style={[styles.info, { justifyContent: 'space-between' }]}>
                  <View>
                    <Text style={styles.textInstall}>
                      {cancelled ? 'esperando activación' : 'instalando dispositivo'}
                      {model ? (
                        <>
                          {' en tu '}
                          <Text
                            style={[styles.carInfoWaiting, { lineHeight: 20 }]}>
                            {model}
                          </Text>
                        </>
                      ) : null}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={require('../../assets/images/instalando.png')}
                      style={styles.imageInstall}
                    />
                  </View>
                </View>
              ) : null}

              {enabled && !dateSentActivated ? (
                <View style={[styles.info, { flexDirection: 'column' }]}>
                  <Text style={styles.carInfoWaiting}>{model}</Text>
                  <Text
                    style={[
                      styles.textInstall,
                      { maxWidth: 270, marginBottom: 15, marginLeft: 0 },
                    ]}>
                    DISPOSITIVO INSTALADO
                  </Text>
                  <View>
                    <Button
                      text="SINCRONIZAR"
                      onPress={activeSubscription}
                      stylesExternal={{ width: width * 0.7 }}
                    />
                  </View>
                </View>
              ) : null}

              {!activated && !enabled && dateSentActivated ? (
                <View style={styles.infoContainer}>
                  <View style={styles.carInfoWrapper}>
                    <View style={styles.typOfCar}>
                      <Text style={styles.carInfoWaiting}>{model}</Text>
                      <Text
                        style={styles.textInstall}>
                        SINCRONIZANDO SERVICIOS
                      </Text>
                    </View>
                    <View>
                      <CountDown
                        until={differenceInSeconds(
                          addHours(dateSentActivated, 48),
                          new Date(),
                        )}
                        digitStyle={{ backgroundColor: 'white' }}
                        digitTxtStyle={{
                          color: '#525F6F',
                          fontSize: width < 540 ? 22 : 26,
                          fontFamily: 'Raleway-Bold',
                        }}
                        timeLabelStyle={{
                          color: '#525F6F',
                          fontSize: 7,
                          fontFamily: 'Raleway-Regular',
                          textTransform: 'uppercase',
                        }}
                        timeToShow={['H', 'M', 'S']}
                        timeLabels={{ d: 'DÍAS', h: 'HRS', m: 'MIN', s: 'SEG' }}
                      />
                    </View>
                  </View>
                  <Image
                    style={styles.imageCountdown}
                    source={require('../../assets/images/auto_arboles.png')}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };

  render() {
    const { cars, selectedIndex } = this.props;
    return (
      <View style={styles.carStatus}>
        <Carousel
          ref={this.carouselRef}
          style={styles.carStatus}
          sliderWidth={width}
          itemWidth={width * 0.75 + 10}
          renderItem={this._renderItem}
          data={cars}
          inactiveSlideOpacity={1}
          ref={this.carouselRef}
          onSnapToItem={index =>
            this.props.selectCar(cars[index].subscriptionId)
          }
          firstItem={Number.isInteger(selectedIndex) ? selectedIndex : 0}
        />
        <Pagination
          dotsLength={cars.length}
          activeDotIndex={Number.isInteger(selectedIndex) ? selectedIndex : 0}
          containerStyle={{ marginTop: -25 }}
          dotStyle={{
            backgroundColor: '#4BA4CB',
            marginHorizontal: -10,
          }}
          inactiveDotStyle={{
            backgroundColor: '#9298A1',
            marginHorizontal: -10,
          }}
        />
      </View>
    );
  }
}
CarInformation.propTypes = {
  cars: t.array,
  selectCar: t.func,
  enableCar: t.func,
  selectedIndex: t.number,
  shouldSelectFirst: t.bool,
};

const mapStateToProps = state => {
  let cars = Object.values(state.cars.data).filter(car => !car.cancelled).map(car => {
    const carMapInfo = state.map.data[car.subscriptionId] || {};
    return {
      ...car,
      ...carMapInfo,
      address: state.map.incognitoIds.includes(car.id)
        ? null
        : carMapInfo.address,
    };
  });
  const selectedId = state.map.selected;
  return {
    cars: cars.length ? cars : Object.keys(state.cars.data).length > 0 ? [{ cancelled: true }] : [{ mock: true }],
    selectedIndex: selectedId
      ? cars.findIndex(car => car.subscriptionId === selectedId)
      : null,
    shouldSelectFirst: !!cars.length && !selectedId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCar: id => dispatch(selectCar(id)),
    enableCar: data => dispatch(enableCar(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarInformation);

const styles = StyleSheet.create({
  typOfCar: {
    flex: 1,
  },
  carInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 11,
    color: '#475563',
    maxWidth: width * 0.7 - 121,
  },
  status: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  carName: {
    color: '#475563',
    fontSize: 13,
    fontFamily: 'Raleway-Bold',
    textTransform: 'uppercase',
  },
  carPlate: {
    fontSize: 18,
    color: '#475563',
    fontFamily: 'Raleway-Regular',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    height: 106,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  carImage: {
    width: 40,
    height: 32,
    resizeMode: 'contain',
  },
  background: {
    backgroundColor: 'white',
    width: width * 0.75,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 0.51,
    shadowRadius: 3.5,
    elevation: 2,
    zIndex: 10,
  },
  carStatus: {
    position: 'absolute',
    top: 10,
    zIndex: 3,
    marginHorizontal: 0,
    alignContent: 'center',
    minHeight: height * 0.15,
  },
  logoContainer: {
    width: 75,
    height: 70,
    backgroundColor: '#475563',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    padding: 6,
  },
  lastAddress: {
    fontSize: 9,
    fontFamily: 'Raleway-Bold',
    color: '#6A81BF',
    textAlign: 'left',
  },
  textInstall: {
    fontSize: width < 540 ? 13 : 16,
    fontFamily: 'Raleway-Regular',
    color: '#475563',
    textTransform: 'uppercase',
    maxWidth: 120,
    marginRight: 4,
  },
  imageInstall: {
    width: width * 0.3,
    height: 96,
    resizeMode: 'contain',
    marginRight: 10,
  },
  imageCountdown: {
    flex: 1,
    width: width * 0.75,
    height: 42,
    position: 'absolute',
    bottom: 0,
    borderRadius: 12,
  },
  LinearGradientStyle: {
    height: 36,
    width: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    textTransform: 'uppercase',
  },
  carInfoWaiting: {
    fontFamily: 'Raleway-Bold',
    fontSize: 13,
    color: '#475563',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  plateText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Raleway-Bold',
    marginTop: 6,
  }
});

CarInformation.propTypes = {
  update: PropTypes.func,
  marginTop: PropTypes.any,
  address: PropTypes.any,
};
