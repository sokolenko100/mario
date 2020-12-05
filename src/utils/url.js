/*
 * File: url.js
 * Project: mariposa
 * File Created: Monday, 23rd September 2019 1:03:29 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Thursday, 3rd October 2019 4:00:38 pm
 * Modified By: Mario Merino (mario@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

export const getParamsFromUrl = url => {
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};

export const getPathFromUrl = (url, base) => {
  return url
    .split(base)
    .join('')
    .split('?')[0];
};
