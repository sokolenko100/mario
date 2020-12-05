/* eslint-disable no-unused-vars */
/**
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 5th July 2019 5:20:43 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 1:26:08 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Content, Container, View, Toast, Picker} from 'native-base';
import Header from '../../reusable/header';
import CalendarSelector from '../../reusable/calendar';
import NewInput from '../../reusable/newInput';
import InputApp from '../../reusable/input';
import AppPicker from '../../reusable/picker';
import {getCarImage} from '../../../assets/images/colores_autos';
import Construction from '../../reusable/construction';
import {devlog} from '../../utils/log';
import {patchCar} from '../../redux/modules/cars';
import {formatPlateNumber} from '../../utils/text';
import t from 'prop-types';
const {width} = Dimensions.get('window');
const getFuelType = type => {
  const FUEL_TYPES = {
    P: 'Bencina',
    D: 'Diesel',
    H: 'Hibrido',
    E: 'Eléctrico',
  };
  return FUEL_TYPES[type] || 'Desconocido';
};
class MiAuto extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      colour: '',
      fuelType: '',
      make: '',
      mileage: '',
      model: '',
      plateNumber: '',
      yieldValue: '',
      selected: null,
    };
  }
  static propTypes = {
    cars: t.array,
    loading: t.bool,
    patchCar: t.func
  }
  static getDerivedStateFromProps(props, state) {
    const {selected} = state;
    const getSelectedCarFromProps = () => {
      const {cars} = props;
      const selectedCar = Number.isInteger(selected) ? cars[selected] : {};
      const {
        colour,
        fuelType,
        make,
        mileage,
        model,
        plateNumber,
        yield: yieldValue,
        subscriptionId,
      } = selectedCar || {};
      return {
        colour,
        fuelType,
        make,
        mileage,
        model,
        plateNumber,
        yieldValue,
        subscriptionId,
      };
    };
    if (state.changeCar) {
      return {...getSelectedCarFromProps(), changeCar: false};
    }
    return null;
  }

  handleValueChange = (name, value) => {
    devlog({name, value});
    this.setState({[name]: value});
  };
  componentDidUpdate(prevProps, prevState) {
    if (!Number.isInteger(prevState.selected) && this.props.cars.length) {
      this.setState({selected: 0});
    }
    if (Number.isInteger(prevState.selected) && !this.props.cars.length) {
      this.setState({selected: null});
    }
    if (
      Number.isInteger(this.state.selected) &&
      prevState.selected !== this.state.selected
    ) {
      this.setState({changeCar: true});
    }
    if (prevProps.loading && !this.props.loading) {
      this.setState({changeCar: true});
    }
  }

  handleEndValueChange = async () => {
    this.setState(
      {plateNumber: formatPlateNumber(this.state.plateNumber)},
      async () => {
        const {subscriptionId, plateNumber, yieldValue, mileage} = this.state;
        const success = await this.props.patchCar({
          subscriptionId,
          plateNumber,
          yieldValue,
          mileage,
        });
        if (success) {
          return Toast.show({
            text: 'Datos guardados',
            buttonText: '',
            duration: 1500,
            type: 'success',
            position: 'top',
          });
        }
        return Toast.show({
          text: 'Error al actualizar los datos',
          buttonText: '',
          duration: 1500,
          type: 'danger',
          position: 'top',
        });
      },
    );
  };
  render() {
    const {cars} = this.props;
    const {
      colour,
      fuelType,
      make,
      mileage,
      model,
      plateNumber,
      yieldValue,
      selected,
    } = this.state;
    return cars.length !== 0 ? (
      <Container>
        <Header title={'MI AUTO'} />
        <Content style={[styles.container, {zIndex: -3}]}>
          <View style={styles.banner}>
            <Image
              style={styles.bannerMap}
              source={require('../../../assets/images/mapa_fondo_miauto.png')}
            />
            <View style={styles.bannerCar}>
              <View style={styles.circle1} />
              <View style={styles.circle2} />
              <View style={styles.circle3} />
              <Image style={styles.car} source={getCarImage(colour)} />
              {selected > 0 && (
                <TouchableOpacity
                  style={styles.leftArrow}
                  onPress={() => this.setState({selected: selected - 1})}>
                  <View style={styles.arrowContainer}>
                    <Image
                      style={styles.leftArrowSize}
                      source={require('../../../assets/images/leftArrow.png')}
                    />
                  </View>
                </TouchableOpacity>
              )}
              {selected < cars.length - 1 && (
                <TouchableOpacity
                  style={styles.rightArrow}
                  onPress={() => this.setState({selected: selected + 1})}>
                  <View style={styles.arrowContainer}>
                    <Image
                      style={styles.leftArrowSize}
                      source={require('../../../assets/images/rightArrow.png')}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.model}>
            <Text style={styles.modelText}>{make}</Text>
            <View style={styles.modelVersion}>
              <View>
                {/* <Text style={styles.modelVersionTitle}>Modelo</Text> */}
                <Text style={styles.modelVersionValue}>{model}</Text>
              </View>
              {/* <View>
                <Text style={styles.modelVersionTitle}>Versión</Text>
                <Text style={styles.modelVersionValue}>vmtossuzuk200t0004</Text>
              </View> */}
            </View>
          </View>
          <View style={styles.option}>
            <View>
              <Text style={styles.titleInput}>PATENTE</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Para identificar tu auto y avisarte cuando tengas restricción
                </Text>
              </View>
              <View style={styles.input}>
                <InputApp
                  name={'plateNumber'}
                  value={plateNumber}
                  inputKey={'plateNumber'}
                  type={'default'}
                  onValueChange={this.handleValueChange}
                  disabled={false}
                  onFinalValueChange={this.handleEndValueChange}
                />
              </View>
            </View>
          </View>
          {/* <View style={styles.option}>
            <View>
              <Text style={styles.titleInput}>KILOMETRAJE - Km</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Te notificaremos cuándo debas realizar mantenciones
                </Text>
              </View>
              <View style={styles.input}>
                <InputApp
                  name={'mileage'}
                  value={String(mileage)}
                  inputKey={'mileage'}
                  type={'numeric'}
                  onValueChange={this.handleValueChange}
                  disabled={false}
                  onFinalValueChange={this.handleEndValueChange}
                />
              </View>
            </View>
          </View>
          <View style={styles.option}>
            <View>
              <Text style={styles.titleInput}>RENDIMIENTO - Km / lt</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Lo utilizamos para calcular el gasto aprox. de combustible
                </Text>
              </View>
              <View style={styles.input}>
                <Picker
                  selectedValue={String(Math.trunc(yieldValue))}
                  style={{
                    height: 30,
                    width: 84,
                    borderRadius: 10,
                    backgroundColor: '#F4F4F4',
                    marginRight: 0,
                    fontSize: 12,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    this.setState({yieldValue: itemValue});
                    this.handleEndValueChange();
                  }}>
                  {Array.from({length: 40}).map((_, i) => (
                    <Picker.Item
                      label={String(i + 1)}
                      value={String(i + 1)}
                      key={i}
                    />
                  ))}
                </Picker>
                {/* <InputApp
                  name={'yield'}
                  value={String(yieldValue)}
                  inputKey={'yieldValue'}
                  type={'numeric'}
                  onValueChange={this.handleValueChange}
                  disabled={false}
                  onFinalValueChange={this.handleEndValueChange}
                /> */}
          {/* </View>
            </View>
          </View> */}
          {/*
          <View style={[styles.option, {marginBottom: 20}]}>
            <View>
              <Text style={styles.titleInput}>COMBUSTIBLE</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  Para calcular el gasto aproximado de cada viaje
                </Text>
              </View>
              <View style={styles.input}>
                <InputApp
                  name={'fuelType'}
                  value={getFuelType(fuelType)}
                  inputKey={'fuelType'}
                  type={'default'}
                  disabled
                  colored
                />
              </View>
            </View>
          </View>
         */}
        </Content>
      </Container>
    ) : (
      <Construction
        title={'ESPERANDO ACTIVACIÓN'}
        message={
          'Una vez activado el servicio, tendrás disponible la información de tu auto'
        }
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    cars: Object.values(state.cars.data).filter(car => car.vin && !car.cancelled),
    loading: state.cars.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    patchCar: ({subscriptionId, plateNumber, yieldValue, mileage}) =>
      dispatch(
        patchCar({subscriptionId, plateNumber, yield: yieldValue, mileage}),
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MiAuto);
const styles = StyleSheet.create({
  container: {
    marginBottom: 60,
  },
  titleInput: {
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#475563',
    marginBottom: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    paddingRight: 20,
  },
  input: {
    flex: 0.4,
  },
  option: {
    paddingHorizontal: 23,
    marginTop: 28,
    paddingBottom: 28,
    borderBottomColor: '#C8CBD1',
    borderBottomWidth: 0.87,
  },
  labelText: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    color: '#475563',
  },
  banner: {
    paddingBottom: 90,
    backgroundColor: '#FBFBFB',
  },
  bannerMap: {
    height: 110,
  },
  bannerCar: {
    position: 'absolute',
    top: 86,
    left: width * 0.43,
  },
  circle1: {
    height: 71,
    width: 71,
    borderRadius: 71 / 2,
    backgroundColor: '#6A81BF',
    position: 'absolute',
    left: width * -0.0319,
    top: -12,
  },
  circle2: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    backgroundColor: '#6A81BF',
    opacity: 0.3,
    position: 'absolute',
    left: width * -0.0319 - 30 / 2,
    top: -26,
  },
  circle3: {
    height: 124,
    width: 124,
    borderRadius: 124 / 2,
    backgroundColor: '#6A81BF',
    opacity: 0.2,
    position: 'absolute',
    left: width * -0.0319 - 30 / 2 - 24 / 2,
    top: -38,
  },
  car: {
    width: 48,
    height: 49,
    position: 'absolute',
  },
  model: {
    backgroundColor: '#FBFBFB',
    paddingBottom: 26,
  },
  modelText: {
    fontSize: 18,
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#475563',
    marginBottom: 14,
  },
  leftArrowSize: {
    width: 12,
    height: 20,
  },
  leftArrow: {
    position: 'absolute',
    top: 14,
    left: width * -0.19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    position: 'absolute',
    top: 14,
    left: width * 0.3,
  },
  arrowContainer: {
    height: 25,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelVersion: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modelVersionTitle: {
    color: '#475563',
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 5,
  },
  modelVersionValue: {
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
