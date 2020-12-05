/*
 * File: Filter.js
 * Project: mariposa
 * File Created: Tuesday, 6th August 2019 1:51:44 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 18th November 2019 9:33:11 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {View, Text} from 'native-base';
import {withNavigation} from 'react-navigation';
import Button from '../../../../reusable/button';
import {setVoucherIdsFilter, getTrips, setDateRangeFilter, clearTrips} from '../../../../redux/modules/trips';
import CalendarSelector from '../../../../reusable/calendar';
import { parse} from '../../../../utils/datetimes';
import t from 'prop-types';
const {height} = Dimensions.get('screen');
const CarRow = ({plateNumber, brand, selected, onSelect}) => {
  const brandsLogos = {
    haval: require('../../../../../assets/images/logos_marcas/haval.png'),
    jac: require('../../../../../assets/images/logos_marcas/jac.png'),
    renault: require('../../../../../assets/images/logos_marcas/renault.png'),
    suzuki: require('../../../../../assets/images/logos_marcas/suzuki.png'),
    greatwall: require('../../../../../assets/images/logos_marcas/greatwall.png'),
    mazda: require('../../../../../assets/images/logos_marcas/mazda.png'),
    changan: require('../../../../../assets/images/logos_marcas/changan.png'),
  };
  const brandLogo = brandsLogos[brand.toLowerCase()]
    ? brandsLogos[brand.toLowerCase()]
    : require('../../../../../assets/images/logos_marcas/logo_dercomaq.png');
  return (
    <TouchableWithoutFeedback onPress={onSelect}>
      <View style={[carStyles.container, {opacity: selected ? 1 : 0.5}]}>
        <Image source={brandLogo} style={carStyles.brandLogo} />
        <Text style={carStyles.plateNumber}>{plateNumber}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
CarRow.propTypes = {
  plateNumber: t.string,
  brand: t.string,
  selected: t.bool,
  onSelect: t.func,
};
const carStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#475563',
    paddingHorizontal: 4,
    paddingVertical: 7,
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: '#475563',
    fontFamily: 'Raleway-SemiBold',
    fontSize: 14,
    lineHeight: 16,
    marginHorizontal: 10,
  },
  brandLogo: {width: 33, height: 27, resizeMode: 'contain', marginBottom: 5},
  plateNumber: {
    color: 'white',
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    lineHeight: 14,
  },
});

function monthDiff(fechaHoy, fechaActivacion) {
  fechaHoy = parse(fechaHoy);
  fechaActivacion = parse(fechaActivacion);
  var months;
  months = (fechaHoy.getFullYear() - fechaActivacion.getFullYear()) * 12;
  months -= fechaActivacion.getMonth() + 1;
  months += fechaHoy.getMonth() + 1;

  return months <= 0 ? 0 : months;
}

const Filter = ({
  show,
  close,
  cars,
  setVoucherIdsFilter,
  setDateRange,
  voucherIdsFilter,
  getTrips,
  clearCurrentTrips
}) => {
  const [carFilters, setCarFilters] = useState(voucherIdsFilter);
  const toggleCar = voucherId =>
    carFilters.includes(voucherId)
      ? setCarFilters(carFilters.filter(car => car !== voucherId))
      : setCarFilters([...carFilters, voucherId]);
  const [selectedDate, setSelectedDate] = useState([]);
  const setSelectedArrayDate = date => {
    // ! Remove comment if need range filter
    // if (selectedDate.length < 2) {
    //   const newDates = [...selectedDate, date].sort();
    //   setSelectedDate(newDates);
    //   return;
    // }
    setSelectedDate([date]);
  };
  let lastDate = new Date();
  cars.forEach(car => {
    const carDate = parse(car.initialDate);
    lastDate = lastDate > carDate ? carDate : lastDate;
  });
  const maxMonths = monthDiff(new Date(), lastDate);
  const handlePress = () => {
    close();
    setVoucherIdsFilter({voucherIds: carFilters});
    setDateRange({ dateRange: selectedDate });
    clearCurrentTrips();
    getTrips();
  };
  if (!show) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/*
      <Text style={styles.title}>CONDUCTOR</Text>
      <View style={[styles.filterContainer, styles.driver]}>
        <Thumbnail
          style={styles.profilePhoto}
          source={require('../../../../assets/images/imagen_avatar.png')}
          small
        />
        <View>
          <Text style={styles.driverTitle}>SELECCIONA EL CONDUCTOR</Text>
          <Text style={styles.driverName}>Javiera Antonia Solis</Text>
        </View>
      </View>
      */}
      {cars.length > 1 && <Text style={styles.title}>SELECCIONA TU AUTO</Text>}
      {cars.length > 1 && (
        <View style={styles.cars}>
          {cars.map(data => (
            <CarRow
              key={data.voucherId}
              {...data}
              selected={carFilters.includes(data.voucherId)}
              onSelect={() => toggleCar(data.voucherId)}
            />
          ))}
        </View>
      )}

      <CalendarSelector
        onSelect={setSelectedArrayDate}
        selected={selectedDate}
        minDate={lastDate}
        maxMonths={maxMonths}
      />
      <View style={styles.buttonContainer}>
        <Button text="APLICAR" onPress={handlePress} />
      </View>
    </View>
  );
};

Filter.propTypes ={
  show: t.bool,
  close: t.func,
  cars: t.array,
  setVoucherIdsFilter: t.func,
  voucherIdsFilter: t.any,
  getTrips: t.func,
  setDateRange: t.func.isRequired,
  clearCurrentTrips: t.func
};
const styles = StyleSheet.create({
  container: {
    height:  height - 110,
    // position: 'absolute',
    // top: Platform.OS === 'ios' ? 64 : 55,
    backgroundColor: '#ffffff',
    width: '100%',
    zIndex: 100,
    padding: 0,
    paddingBottom: 100,
  },
  contentContainer: {
    paddingTop: 45,
    paddingBottom: 52.7,
  },
  title: {
    fontFamily: 'Raleway-Bold',
    fontSize: 16,
    lineHeight: 19,
    color: '#475563',
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 5,
  },

  driver: {
    flexDirection: 'row',
  },
  cars: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  profilePhoto: {
    width: 28,
    height: 28,
    marginRight: 7.94,
  },
  driverName: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: '#475563',
    marginTop: 0,
  },
  driverTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 2,
    color: '#475563',
  },
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 0,
    position: 'absolute',
    bottom: 30,
  },
});

const mapStateToProps = state => ({
  cars: Object.values(state.cars.data)
    .filter(car => car.activated && car.voucherId && !car.cancelled)
    .map(car => ({
      voucherId: car.voucherId,
      plateNumber: car.plateNumber,
      brand: `${car.make} ${car.model}`,
      photo: require('../../../../../assets/images/foto_auto_info.png'),
      initialDate: car.dateReadyOcto,
    })),
  voucherIdsFilter: (state.trips.filters || {}).voucherIds || [],
});

const mapDispatchToProps = dispatch => ({
  setVoucherIdsFilter: ({voucherIds}) =>
    dispatch(setVoucherIdsFilter({voucherIds})),
  setDateRange: ({ dateRange }) => dispatch(setDateRangeFilter({ dateRange })),
  getTrips: date => dispatch(getTrips({date})),
  clearCurrentTrips: () => dispatch(clearTrips())
});
Filter.navigationOptions = {
  tabBarVisible: false,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Filter),
);
