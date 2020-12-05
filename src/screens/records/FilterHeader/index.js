/*
 * File: FilterHeader.js
 * Project: mariposa
 * File Created: Tuesday, 6th August 2019 11:52:11 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Wednesday, 6th November 2019 6:37:48 pm
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
import {withNavigation} from 'react-navigation';

// import Filter from './Filter';

const FilterHeader = ({title, navigation, loading,activeFilter }) => {
  const toggleFilter = () => navigation.navigate('filter');
  return (
    <View style={[Platform.OS === 'ios' && styles.iosFilter ]}>
      <Header style={styles.header} androidStatusBarColor="#696969">
        <Left style={{flex: 1}} />
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
            disabled={loading}
            onPress={toggleFilter}>
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        </Body>
        <Right style={{flex: 1, position: 'relative'}}>
          <TouchableOpacity
            style={[styles.filterIconContainer, loading && { opacity: 0.4 }]}
            disabled={loading}
            onPress={toggleFilter}>
            <Image
              source={

                require('../../../../assets/images/filtro.png')
              }
              style={styles.filterIcon}
            />
            <Text style={styles.filter}>FILTRAR</Text>
            {activeFilter ? <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: '#4BA4CB', right: 5, top: 10}} /> : null}
          </TouchableOpacity>
        </Right>
      </Header>
      {/* <Filter close={toggleFilter} show={showFilter} /> */}
    </View>
  );
};
FilterHeader.propTypes = {
  title: t.string.isRequired,
  loading: t.bool,
  activeFilter: t.bool
};

export default withNavigation(FilterHeader);

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
    width: 22,
    height: 23,
  },
  filterIconContainer: {
    padding: 15,
    paddingRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iosFilter: {
    zIndex: 100,
    //height: '70%'
  },
  containerFilter: {
    position: 'absolute',
    height: '100%',
    top: Platform.OS === 'ios' ? 105 : 55,
    backgroundColor: '#ffffff',
    elevation: 5,
    width: '100%',
    zIndex: 100,
  },
  
  filter: {
    color: '#525f6f',
    fontFamily: 'Raleway-Bold',
    fontSize: 8,
    lineHeight: 10,
    textAlign: 'center',
  }
});
