/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 5th July 2019 5:20:25 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 19th November 2019 12:40:06 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {PureComponent, createRef} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, View, SectionList, Image, Dimensions} from 'react-native';
import {Container, Text, Spinner} from 'native-base';
import {withNavigationFocus} from 'react-navigation';
import capitalize from 'lodash/capitalize';
import {parse, getLongTextWeekDay} from '../../utils/datetimes';
import {
  getTrips,
  setAddress,
  getOlderTrips,
  getNewerTrips as getNewerTripsAction,
  cleanFilter,
  clearTrips,
} from '../../redux/modules/trips';
import Constants from '../../utils/constants';
import {getTextWeekDay, getYearMonth, getDate} from '../../utils/datetimes';

import RecordItem from './RecordItem';
import FilterHeader from './FilterHeader';
import Construction from '../../reusable/construction';
import Button from '../../reusable/button';
import Images from '../../utils/images';


let {width} = Dimensions.get('window');
width = Math.floor(width);
class Records extends PureComponent {
  static propTypes = {
    getTrips: t.func.isRequired,
    trips: t.object,
    loading: t.bool,
    newestDate: t.any,
    getNewerTrips: t.func,
    getOlderTrips: t.func,
    hasTrips: t.bool,
    isReady: t.bool,
    isFocused: t.bool,
    cleanFilter: t.func.isRequired,
    tripIds: t.arrayOf(t.number),
    activeFilter: t.bool,
    filtersDateRange: t.array,
  };
  static defaultProps = {
    trips: {},
    loading: false,
  };
  static navigationOptions = ({navigation}) => {
    return {
      tabBarVisible: !navigation.getParam('showFilter'),
    };
  };
  state = {
    currentMonth: getYearMonth(new Date()),
    opened: [],
    newestDate: this.props.newestDate,
    currentHeight: 0,
  };
  sectionList = createRef();
  componentDidMount() {
    const {getTrips} = this.props;
    getTrips({page: 1});
  }
  componentDidUpdate(prevProps) {
    if(prevProps.isFocused !== this.props.isFocused && !this.props.isFocused) {
      this.props.cleanFilter();
    }

  }
  keyExtractor = item => {
    return item.id;
  };
  setOnScreenMonth = viewable => {
    if (viewable) {
      this.setState({currentMonth: viewable.section.yearMonth});
    }
  };
  formatTrips = () => {
    const {trips, loading, activeFilter} = this.props;
    return Object.entries(trips).map(([, dateTrips], index, arr) => ({
      title: capitalize(getTextWeekDay(dateTrips[0].startDate)),
      data: [
        ...dateTrips,
        ...(arr.length === index + 1 ? loading ? [{loading}] : [{button: true, activeFilter}] : []),
      ],
      yearMonth: capitalize(getYearMonth(dateTrips[0].startDate)),
    }));
  };
  handleOpen = tripId => {
    this.setState({
      opened: [...this.state.opened, tripId],
    });
  };
  handleClose = tripId => {
    this.setState({
      opened: this.state.opened.filter(id => id !== tripId),
    });
  };
  scrollToTop = date => {
    this.setState({newestDate: date});
    this.sectionList.current.scrollToLocation({
      sectionIndex: 0,
      itemIndex: 0,
      viewOffset: 0,
      viewPosition: 0,
      animated: false,
    });
  };

  onTopReached = async e => {
    if (e.nativeEvent.contentOffset.y < 20) {
      await this.props.getNewerTrips();
    }
  };
  render() {
    const {currentMonth, opened} = this.state;
    const {loading, getTrips, hasTrips, isReady, tripIds,activeFilter, filtersDateRange } = this.props;
    const sections = this.formatTrips();
    const months = Array.from(
      new Set(sections.map(section => section.yearMonth)),
    );
    return (
      <Container>
        <FilterHeader
          title={currentMonth}
          goToTop={this.scrollToTop}
          months={months}
          loading={loading}
          activeFilter={activeFilter}
        />
        {hasTrips ? (
          <>
            <SectionList
              style={{paddingTop: 0, zIndex: -3}}
              onRefresh={getTrips}
              ref={this.sectionList}
              sections={sections}
              stickySectionHeadersEnabled
              removeClippedSubviews={false}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              refreshing={loading}
              renderItem={({item}) => {
                if (item.loading) {
                  return (
                    <View style={styles.loaderContainer}>
                      <Spinner color={Constants.themeColor} />
                      <Text style={styles.loaderText}>Cargando viajes</Text>
                    </View>
                  );
                }
                if (item.button)
                  return (
                    <View style={styles.filterButton}>
                      {item.activeFilter ? (
                        <Button stylesExternal={{ width: '100%' }}  whiteMode shadow text="LIMPIAR FILTRO" onPress={() => this.props.cleanFilter()} />
                      ) : (
                        <Button stylesExternal={{ width: '100%' }} whiteMode shadow text="CARGAR MÁS" onPress={() => this.props.getOlderTrips()}/>
                      )}
                    </View>
                  );
                return (
                  <RecordItem
                    key={item.id}
                    {...item}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                  />
                );
              }}
              renderSectionHeader={({section: {title, data}}) => (
                <Text
                  style={[
                    styles.label,
                    data.some(({id}) => opened.includes(id))
                      ? {color: 'transparent'}
                      : {},
                    {paddingTop: 10, textTransform: 'uppercase'},
                  ]}>
                  {title}
                </Text>
              )}
              // onEndReached={() => this.props.getOlderTrips()}
              keyExtractor={this.keyExtractor}
              SectionSeparatorComponent={() => <View />}
              ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              onViewableItemsChanged={({viewableItems: [viewable]}) => {
                this.setOnScreenMonth(viewable);
              }}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              removeClippedSubviews
              contentContainerStyle={{ paddingBottom: 95 }}
              extraData={{tripIds}}
            />
          </>
        ) : (
          loading ?
            <View style={styles.loaderContainer}>
              <Spinner color={Constants.themeColor} />
              <Text>Cargando viajes</Text>
            </View>
            :
            isReady ? (
              <View style={styles.crashContainer}>
                <View style={styles.crashInfo}>
                  {filtersDateRange.length === 0 ? 
                    <Text style={styles.crashBody}>No tienes viajes. </Text> : null}
                  {filtersDateRange.length === 1 ? 
                    <Text style={styles.crashBody}>No existen viajes para el <Text style={styles.crashBodyBold}> {getLongTextWeekDay(filtersDateRange[0])}</Text>. Intenta con otro día</Text> : null}
                  {filtersDateRange.length === 2 ? 
                    <Text style={styles.crashBody}>No existen viajes entre el {getLongTextWeekDay(filtersDateRange[0])} y el {getLongTextWeekDay(filtersDateRange[1])}</Text> : null}
                  <Text style={styles.crashBody}></Text>
                </View>
                <Image source={Images.notFound} style={styles.notFoundImage} />
                {filtersDateRange.length > 0 ? <Button whiteMode shadow text="LIMPIAR FILTRO" onPress={() => this.props.cleanFilter()} /> : null}
              </View>
            ) : (
              <Construction
                title={'ESPERANDO ACTIVACIÓN'}
                message={
                  'Una vez activado el servicio, tendrás disponible la información de tu auto'
                }
              />
            )
        )}
      </Container>
    );
  }
}
const mapStateToProps = ({trips: {data, loading, filters = { voucherIds: [], dateRange: [] }, newestDate}, cars} = {}) => {
  const filteredDataByCars = filters.voucherIds.length
    ? Object.values(data).filter(trip =>
      filters.voucherIds.includes(trip.voucherId),
    )
    : Object.values(data);
  const trips = filteredDataByCars.sort(
    (a, b) => parse(b.startDate) - parse(a.startDate),
  );
  const groupedTripsByDate = trips.reduce((grouped, trip) => {
    const currentDate = getDate(trip.startDate);
    return {
      ...grouped,
      [currentDate]: [
        ...(grouped[currentDate] || []),
        {id: trip.id, startDate: trip.startDate},
      ].sort((a, b) => parse(b.startDate) - parse(a.startDate)),
    };
  }, {});

  const anyActive = Object.values(cars.data).some(car => car.activated);
  return {
    trips: groupedTripsByDate,
    newestDate,
    loading,
    hasTrips: Object.values(data) && Object.values(data).length > 0,
    isReady: anyActive,
    tripIds: filteredDataByCars.map(trip => trip.id),
    activeFilter: filters.voucherIds.length || filters.dateRange.length,
    filtersDateRange: filters.dateRange
  };
};
const mapDispatchToProps = dispatch => ({
  getTrips: ({page} = {}) => dispatch(getTrips({page})),
  getOlderTrips: () => dispatch(getOlderTrips()),
  getNewerTrips: () => dispatch(getNewerTripsAction()),
  setAddress: id => dispatch(setAddress(id)),
  cleanFilter: () => {
    dispatch(cleanFilter());
    dispatch(clearTrips());
    dispatch(getTrips());
  },
});
export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Records));

const styles = StyleSheet.create({
  itemSeparator: {
    height: 20,
  },
  label: {
    width: 38,
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    marginLeft: 5,
  },
  crashContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  crashImage: {
    width: 232,
    height: 130,
  },
  notFoundImage: {
    width: 232,
    height: 218,
    marginVertical: 44
  },
  crashInfo: {
    marginHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  crashTitle: {
    color: '#6a7688',
    fontFamily: 'Raleway-Bold',
    fontSize: 22,
    lineHeight: 26,
  },
  crashBody: {
    color: '#8e96ab',
    fontFamily: 'Raleway-Regular',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center'
  },
  crashBodyBold: {
    fontFamily: 'Raleway-Bold',
    fontSize: 20,
    lineHeight: 24,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%'
  },
  loaderText: {
    color: '#6a7688',
    fontFamily: 'Raleway-Regular',
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 60,
    width: width -60-32
  }
});
