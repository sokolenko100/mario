/*
 * File: calendar.js
 * Project: mariposa
 * File Created: Thursday, 29th August 2019 10:52:11 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:22:38 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {CalendarList, LocaleConfig} from 'react-native-calendars';
import {parse, getBetweenDates, getDate} from '../utils/datetimes';
import t from 'prop-types';
LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene.',
    'Feb.',
    'Mar.',
    'Abr.',
    'May.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dic.',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export default class CalendarSelector extends Component {
  constructor() {
    super();
  }

  onDayPress = day => {
    if (parse(day.dateString) > new Date()) {
      return;
    }
    const {onSelect, selected} = this.props;
    onSelect(day.dateString === selected ? '' : day.dateString);
  };

  render() {
    const {selected} = this.props;
    return (
      <View style={{flex: 1, margin: 0}}>
        <CalendarList
          style={{margin: 0, width: '100%'}}
          pastScrollRange={12}
          futureScrollRange={0}
          pastScrollRange={this.props.maxMonths}
          scrollEnabled={true}
          showScrollIndicator={true}
          maxDate={new Date()}
          markedDates={
            getBetweenDates(...selected.map(date => parse(date))).reduce((all, date, i, array) => ({
              ...all,
              [getDate(date)]: {startingDay: i === 0,endingDay: array.length - 1 === i, color: '#4BA4CB', textColor: '#fff', selected: i !== 0 && array.length -1 !== i},
            }), {})
          }
          onDayPress={this.onDayPress}
          markingType="period"
          onDayLongPress={this.onDayPress}
          minDate={this.props.minDate}
          firstDay={1}
          theme={{
            'stylesheet.calendar.header': {
              header: {
                backgroundColor: '#F4F4F4',
                alignItems: 'center',

                // marginTop: 5,
                // flexDirection: 'row',
                // justifyContent: 'space-between',
              },
            },
            backgroundColor: '#F4F4F4',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#475563',
            selectedDayBackgroundColor: '#4BA4CB',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#4BA4CB',
            dayTextColor: '#475563',
            textDisabledColor: '#C8CBD1',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#4BA4CB',
            monthTextColor: '#475563',
            indicatorColor: '#475563',
            textDayFontFamily: 'Raleway-Regular',
            textMonthFontFamily: 'Raleway-Bold',
            textDayHeaderFontFamily: 'Raleway-Bold',
            textDayFontWeight: 'normal',
            textMonthFontWeight: 'normal',
            textDayHeaderFontWeight: 'normal',
            textDayFontSize: 18,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        />
      </View>
    );
  }
}
CalendarSelector.propTypes = {
  onSelect: t.func, 
  selected: t.bool,
  maxMonths: t.any,
  minDate: t.any,
};

// eslint-disable-next-line no-unused-vars
const styles = StyleSheet.create({});
