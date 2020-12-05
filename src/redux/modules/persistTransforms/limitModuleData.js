/*
 * File: limitModuleData.js
 * Project: autoconectado
 * File Created: Wednesday, 6th November 2019 12:26:31 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Wednesday, 6th November 2019 12:38:07 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import { createTransform} from 'redux-persist';

const limitModuleDataLengthCreator = ({ length = 50, whitelist = [] }) => createTransform(
  // transform state on its way to being serialized and persisted.
  inboundState => {
    // convert mySet to an Array.
    const values = Object.values(inboundState.data).slice(0, length);
    const data = values.reduce(
      (all, element) => ({...all, [element.id]: element}),
      {},
    );
    return {...inboundState, data};
  },
  // transform state being rehydrated
  outboundState => {
    // convert mySet back to a Set.
    return {...outboundState};
  },
  // define which reducers this transform gets called for.
  {whitelist},
);
export const limitModuleDataTripsLength = limitModuleDataLengthCreator({ length: 50, whitelist: ['trips']});
export const limitModuleDataTripsDetailLength = limitModuleDataLengthCreator({ length: 500, whitelist: ['tripsDetail']});

