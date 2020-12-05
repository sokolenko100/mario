/*
 * File: datetimes.js
 * Project: mariposa
 * File Created: Wednesday, 31st July 2019 10:36:47 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 18th November 2019 10:56:47 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import {
  format,
  isSameDay,
  addHours,
  parse,
  addDays,
  differenceInSeconds,
  getMinutes,
  getHours,
  getSeconds,
  getDayOfYear,
  endOfDay,
  startOfDay
} from 'date-fns';
import es from 'date-fns/locale/es';
import capitalize from 'lodash/capitalize';
import {formatToTimeZone} from 'date-fns-timezone';

export const readableTime = date => format(date, 'HH:mm');
export const readableTimeWithSeconds = date => format(date, 'hh:mm:ss');
export const getTextWeekDay = date => format(date, 'ddd D', {locale: es});

const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const getLongTextWeekDay = date => format(date, '[' + days[Number(format(date, 'E'))] +'] D [de] MMMM', {locale: es});

export const getYearMonth = date =>
  capitalize(format(date, 'MMMM YYYY', {locale: es}));
export const getDate = date => format(date, 'YYYY-MM-DD');
export const dateWithoutTimezone = date => {
  const timezoneDiff = date.getTimezoneOffset() / 60;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);
  return dateWithoutTimezoneDiff;
};
export const formatToUTC = date => formatToTimeZone(parse(date), 'YYYY-MM-DDTHH:mm:ssZ', {timeZone: 'Etc/GMT+0'});

export const getBetweenDates = (start, end = start) => {
  const between = [];
  let newStart = addDays(start, 0);
  while(newStart <= end) {
    between.push(newStart);
    newStart = addDays(newStart, 1);
  }
  return between;
};


export const convertToDuration = secondsAmount => {
  const normalizeTime = time => (time.length === 1 ? `0${time}` : time);

  const SECONDS_TO_MILLISECONDS_COEFF = 1000;
  const MINUTES_IN_HOUR = 60;

  const milliseconds = secondsAmount * SECONDS_TO_MILLISECONDS_COEFF;

  const date = new Date(milliseconds);
  const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);
  const hours = normalizeTime(
    String(
      getHours(dateWithoutTimezoneDiff) +
        24 * (getDayOfYear(dateWithoutTimezoneDiff) - 1),
    ),
  );
  const minutes = normalizeTime(String(getMinutes(dateWithoutTimezoneDiff)));
  const seconds = normalizeTime(String(getSeconds(dateWithoutTimezoneDiff)));

  const hoursOutput = hours !== '00' ? `${hours}:` : '';

  return `${hoursOutput}${minutes}:${seconds}`;
};

export {isSameDay, parse, addDays, differenceInSeconds, addHours, endOfDay, startOfDay};
