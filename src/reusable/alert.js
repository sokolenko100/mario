/*
 * File: alert.js
 * Project: mariposa
 * File Created: Monday, 5th August 2019 10:42:15 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 2:26:27 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import t from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
const {width} = Dimensions.get('window');

export default class Alert extends Component {
  static propTypes = {
    header: t.string.isRequired,
    body: t.string.isRequired,
    actions: t.arrayOf(
      t.shape({
        text: t.string.isRequired,
        onPress: t.func,
        main: t.bool,
      }),
    ),
    visible: t.bool,
    closeModal: t.func,
    danger: t.bool,
  };
  render() {
    const {
      header,
      body,
      actions,
      visible,
      closeModal = () => {},
      danger,
      ...props
    } = this.props;
    return (
      <Modal
        isVisible={visible}
        backdropColor="#243142"
        backdropOpacity={0.5}
        onBackdropPress={closeModal}
        {...props}>
        <View style={styles.card}>
          <View style={[styles.cardHeader, danger && styles.cardHeaderDanger]}>
            <Text style={[styles.header, danger && {color: 'white'}]}>
              {header}
            </Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.body}>{body}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.cardActions}>
            {actions.map(({text, onPress = () => {}, main}) => (
              <TouchableOpacity
                key={text}
                onPress={onPress}
                style={styles.action}>
                <View>
                  <Text
                    style={[styles.actionText, main && styles.mainActionText]}>
                    {text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.7307,
    borderRadius: 11,
    backgroundColor: 'white',
    shadowColor: 'rgba(255,255,255,0.37)',
    shadowOffset: {height: 7, width: 2},
    alignSelf: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardHeader: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardHeaderDanger: {
    backgroundColor: '#dc5868',
  },
  header: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#475563',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 17,
    marginBottom: 11,
  },
  cardBody: {
    marginVertical: 22,
    marginHorizontal: 30,
  },
  body: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#475563',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: width * 0.68,
    backgroundColor: '#c8cbd1',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  action: {
    paddingTop: 14,
    paddingBottom: 21,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 16,
  },
  mainActionText: {
    fontFamily: 'Raleway-Bold',
  },
});
