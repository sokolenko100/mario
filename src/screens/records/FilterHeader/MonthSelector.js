/*
 * File: MonthSelector.js
 * Project: mariposa
 * File Created: Tuesday, 6th August 2019 12:54:34 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 11:21:10 am
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Platform} from 'react-native';
import {getTrips} from '../../../redux/modules/trips';
import CalendarSelector from '../../../reusable/calendar';
import t from 'prop-types';
const MonthSelector = ({close, goToTop, getTrips}) => {
  const handleSelect = async item => {
    close();
    await getTrips(item);
    goToTop();
  };
  return (
    <View style={styles.container}>
      <CalendarSelector onSelect={handleSelect} />
    </View>
  );
};
MonthSelector.propTypes = {
  close: t.func,
  goToTop: t.func,
  getTrips: t.func
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 500,
    top: Platform.OS === 'ios' ? 105 : 55,
    backgroundColor: '#ffffff',
    elevation: 5,
    width: '100%',
    zIndex: 100,
  },
});
const mapDispatchToProps = dispatch => ({
  getTrips: date => dispatch(getTrips({date})),
});
export default connect(
  null,
  mapDispatchToProps,
)(MonthSelector);
