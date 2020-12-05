/*
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 6th September 2019 10:55:08 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 15th October 2019 2:45:30 pm
 * Modified By: Mario Merino (mario@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

const images = {
  default: require('./gray.png'),
  Beige: require('./beige.png'),
  Black: require('./black.png'),
  Blue: require('./blue.png'),
  Brown: require('./brown.png'),
  Gray: require('./gray.png'),
  Green: require('./green.png'),
  Orange: require('./orange.png'),
  Pink: require('./pink.png'),
  Purple: require('./purple.png'),
  Red: require('./red.png'),
  White: require('./white.png'),
  Yellow: require('./yellow.png'),
};

export const getCarImage = color => images[color] || images.default;

export default images;
