/*
 * File: input.js
 * Project: mariposa
 * File Created: Thursday, 4th July 2019 2:07:28 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Thursday, 14th November 2019 11:12:47 am
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component, createRef} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Input} from 'native-base';
import PropTypes from 'prop-types';
export default class InputApp extends Component {
  Input = createRef();
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
    };
  }

  handleFocus = () => this.setState({isFocus: true});
  handleBlur = () => {
    this.setState({isFocus: false});
    this.props.onFinalValueChange();
  };

  handleChange = textValue => {
    this.props.onValueChange(this.props.inputKey, textValue);
  };
  render() {
    const {value, align, disabled, colored, type, flex, ...props} = this.props;
    return (
      disabled ? 
        <Text style={styles.inputWhite}>
          {value}
        </Text> :
        <Input
          ref={this.Input}
          onChangeText={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          style={[
            styles.input,
            {
              textAlign: align ? align : 'right',
              backgroundColor: disabled && !colored ? 'white' : '#f4f4f4',
            },
            Number.isInteger(flex) && {
              flex
            }
          ]}
          value={value}
          keyboardType={type ? type : 'default'}
          {...props}
        /> 
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    height: 26,
    backgroundColor: '#f4f4f4',
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderRadius: 3,
    zIndex: -3,
  },
  inputWhite: {
    fontSize: 14,
    fontFamily: 'Raleway-Regular',
    height: 26,
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderRadius: 3,
    zIndex: -3,
  },
});
InputApp.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func,
  onFinalValueChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  inputKey: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  align: PropTypes.string,
  colored: PropTypes.bool,
  flex: PropTypes.number
};
