/*
 * File: index.js
 * Project: autoconectado
 * File Created: Wednesday, 6th November 2019 12:38:48 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Wednesday, 6th November 2019 12:39:33 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */



import {limitModuleDataTripsDetailLength,limitModuleDataTripsLength} from './limitModuleData';
import {storeOnlyData} from './removeMetadata';

export default [limitModuleDataTripsDetailLength, limitModuleDataTripsLength, storeOnlyData];


