/*
 * File: log.js
 * Project: mariposa
 * File Created: Thursday, 15th August 2019 6:32:21 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 10:39:03 am
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {SHOULD_LOG} from '../config';

export const devlog = (...params) =>
  // eslint-disable-next-line no-console
  SHOULD_LOG && console.log('DEBUG', ...params);
