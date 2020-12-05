/*
 * File: index.js
 * Project: mariposa
 * File Created: Tuesday, 13th August 2019 5:06:00 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 18th November 2019 11:15:22 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
// eslint-disable-next-line no-undef
const {pathname} = window.location || {};
const IS_RUNNING_IN_CHROME = pathname && pathname.indexOf('debugger-ui');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const SHOULD_LOG = IS_RUNNING_IN_CHROME && !IS_PRODUCTION;

export const INITIAL_ENV = 'qa';
