/*
 * File: faqs.js
 * Project: mariposa
 * File Created: Friday, 27th September 2019 11:41:56 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Monday, 7th October 2019 11:32:01 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import {createReducer, requestAction, errorType, showError, 
  getToken} from '../utils';

const initialState = {data: {}, loading: false};
const type = 'FAQ';

const SET_FAQS = 'SET_FAQS';

export default createReducer({
  initialState,
  type,
  cases: {
    [SET_FAQS]: (state, payload) => ({
      ...state,
      data: payload.reduce((all, faq) => {
        const {category, id, question, answer} = faq;
        if (!all[category]) {
          all[category] = [];
        }
        return {
          ...all,
          [category]: [
            ...all[category],
            {id, title: question, content: answer},
          ],
        };
      }, {}),
    }),
  },
});

export const getFaqs = () => {
  return async (dispatch, getState, {api}) => {
    try {
      const request = () =>
        api
          .withToken(getToken({getState}))
          .faqs.all();
      const {payload} = await requestAction({dispatch, type, request});
      dispatch({type: SET_FAQS, payload});
    } catch (e) {
      dispatch({type: errorType(type), payload: e.message});
      showError(e);
    }
  };
};
