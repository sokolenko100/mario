/*
 * File: removeMetadata.js
 * Project: autoconectado
 * File Created: Wednesday, 6th November 2019 12:38:28 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Wednesday, 6th November 2019 12:38:41 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */



import {createTransform } from 'redux-persist';


export const storeOnlyData = createTransform(
  inboundState => {
    const {loading, error, filters, ...info} = inboundState; // eslint-disable-line no-unused-vars
    return {...info};
  },
  outboundState => {
    // convert mySet back to a Set.
    return {...outboundState};
  },
);