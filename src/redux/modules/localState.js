/*
 * File: localState.js
 * Project: MiAuto
 * File Created: Monday, 22nd July 2019 12:53:07 pm
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 20th August 2019 2:52:54 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

const TOGGLE_FOLLOW_MODE = 'TOGGLE_FOLLOW_MODE';
const SHOW_EMERGENCY_MENU = 'SHOW_EMERGENCY_MENU';
const HIDE_EMERGENCY_MENU = 'HIDE_EMERGENCY_MENU';
const SHOW_MORE_OPTION_MENU = 'SHOW_MORE_OPTION_MENU';
const HIDE_MORE_OPTION_MENU = 'HIDE_MORE_OPTION_MENU';
const OPEN_TERMS = 'OPEN_TERMS';
const CLOSE_TERMS = 'CLOSE_TERMS';
const initialState = {
  followMode: false,
  emergencyMenuShow: false,
  moreOptionShow: false,
  terms: false,
};

export default function localState(state = initialState, action) {
  const {type} = action;
  switch (type) {
  case TOGGLE_FOLLOW_MODE:
    return {
      ...state,
      followMode: !state.followMode,
    };
  case SHOW_EMERGENCY_MENU:
    return {
      ...state,
      emergencyMenuShow: true,
    };
  case HIDE_EMERGENCY_MENU:
    return {
      ...state,
      emergencyMenuShow: false,
    };
  case SHOW_MORE_OPTION_MENU:
    return {
      ...state,
      moreOptionShow: true,
    };
  case HIDE_MORE_OPTION_MENU:
    return {
      ...state,
      moreOptionShow: false,
    };
  case OPEN_TERMS:
    return {
      ...state,
      terms: true,
    };

  case CLOSE_TERMS:
    return {
      ...state,
      terms: false,
    };
  default:
    return state;
  }
}

export const toggleFollowMode = () => ({
  type: TOGGLE_FOLLOW_MODE,
});

export const showEmergencyMenu = () => ({
  type: SHOW_EMERGENCY_MENU,
});

export const hideEmergencyMenu = () => ({
  type: HIDE_EMERGENCY_MENU,
});

export const showMoreOptionsMenu = () => ({
  type: SHOW_MORE_OPTION_MENU,
});

export const hideMoreOptionsMenu = () => ({
  type: HIDE_MORE_OPTION_MENU,
});

export const openTerms = () => ({
  type: OPEN_TERMS,
});

export const closeTerms = () => ({
  type: CLOSE_TERMS,
});
