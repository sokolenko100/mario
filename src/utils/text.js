/*
 * File: text.js
 * Project: mariposa
 * File Created: Wednesday, 18th September 2019 10:37:07 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Friday, 27th September 2019 11:09:26 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
export const formatPlateNumber = (plateNumber = '') => {
  if (!plateNumber) {
    return '';
  }
  const cleanedPlateNumber = plateNumber
    .toUpperCase()
    .replace(/[^0-9A-Z]+/g, '')
    .slice(0, 6);
  return cleanedPlateNumber
    .split('')
    .reduce((array, char) => {
      if (!array.length || array[array.length - 1].length === 2) {
        return [...array, char];
      }
      return [...array.slice(0, -1), array[array.length - 1] + char];
    }, [])
    .join('•');
};
