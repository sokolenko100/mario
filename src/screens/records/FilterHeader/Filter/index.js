/*
 * File: index.js
 * Project: autoconectado
 * File Created: Tuesday, 8th October 2019 1:19:03 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Tuesday, 5th November 2019 3:04:50 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React from 'react';
import t from 'prop-types';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import {Header, Left, Body, Text, Right} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import Filter from './Filter';
import Images from '../../../../utils/images';
import { cleanFilter, getTrips, clearTrips } from '../../../../redux/modules/trips';

const FilterHeader = ({navigation}) => {
  const toggleFilter = () =>navigation.goBack();
  const title = (useSelector((state)=>Object.values(state.cars.data).length) > 1 )? 'FILTRO' : 'SELECCIONA FECHA';
  const dispatch = useDispatch();
  const clean = () => {
    dispatch(cleanFilter());
    dispatch(clearTrips());
    dispatch(getTrips());
  };
  // navigate to ///toggle;
  return (
    <View style={[Platform.OS === 'ios' && styles.iosFilter ]}>
      <Header style={styles.header} androidStatusBarColor="#696969">
        <Left style={{flex: 1}}>
          <TouchableOpacity
            style={styles.filterIconContainerLeft}
            onPress={() => {
              toggleFilter();
              clean();
            }}>
            <Image
              source={
                Images.cleanIcon
              }
              style={styles.filterIcon}
            />
            <Text style={styles.clean}>LIMPIAR</Text>
          </TouchableOpacity>
        </Left>
        <Body
          style={{
            flex: 0,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={toggleFilter}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        </Body>
        <Right style={{flex: 1}}>
          <TouchableOpacity
            style={styles.filterIconContainerRight}
            onPress={toggleFilter}>
            <Image
              source={require('../../../../../assets/images/cerrar.png')}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </Right>
      </Header>
      <Filter close={toggleFilter} show />
    </View>
  );
};
FilterHeader.propTypes = {
  title: t.string.isRequired,
  filterStatus: t.bool
};
FilterHeader.navigationOptions = {
  tabBarVisible: false,
};


export default FilterHeader;

const styles = StyleSheet.create({
  title: {
    color: '#475563',
    fontFamily: 'Raleway-Bold',
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#F4F4F4',
    elevation: 1,
    zIndex: 30,
  },
  headerCenter: {
    justifyContent: 'center',
  },
  dateFilterArrow: {
    width: 8.71,
    height: 8.71,
  },
  dateFilterArrowContainer: {
    paddingTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 4,
  },
  filterIcon: {
    width: 11,
    height: 11,
  },
  filterIconContainerRight: {
    padding: 18,
  },
  filterIconContainerLeft: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iosFilter: {
    zIndex: 100,
    //height: '70%'
  },
  containerFilter: {
    // position: 'absolute',
    height: '100%',
    top: Platform.OS === 'ios' ? 105 : 55,
    backgroundColor: '#ffffff',
    elevation: 5,
    width: '100%',
    zIndex: 100,
  },
  clean: {
    color: '#525f6f',
    fontFamily: 'Raleway-Bold',
    fontSize: 8,
    lineHeight: 10,
    textAlign: 'center',
  }
});

