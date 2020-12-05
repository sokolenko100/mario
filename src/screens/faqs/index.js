/*
 * File: index.js
 * Project: mariposa
 * File Created: Wednesday, 28th August 2019 10:26:21 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 12:35:13 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {Container, Content, ListItem, Text, Body, Right} from 'native-base';
import Header from '../../reusable/header';
import {getFaqs} from '../../redux/modules/faqs';
import t from 'prop-types';
class Faqs extends Component {
  componentDidMount() {
    this.props.getFaqs();
  }
  navigateToOption = category => {
    this.props.navigation.navigate('faqsCategory', {category});
  };
  render() {
    const {categories} = this.props;
    return (
      <Container>
        <Header title={'PREGUNTAS FRECUENTES'} withBack />

        <Content style={{marginTop: 0}}>
          {categories.map(category => {
            return (
              <ListItem
                key={category}
                icon
                style={{marginTop: 20, marginRight: 20}}
                onPress={() => this.navigateToOption(category)}>
                <Body style={[styles.borderBottom]}>
                  <Text style={styles.text}>{category}</Text>
                </Body>
                <Right style={styles.borderBottom}>
                  <Image
                    source={require('../../../assets/images/arrow-menu-rigth.png')}
                    style={styles.iconArrow}
                  />
                </Right>
              </ListItem>
            );
          })}
        </Content>
      </Container>
    );
  }
}

Faqs.propTypes = {
  getFaqs: t.func,
  categories: t.array,
};

const mapStateToProps = state => ({categories: Object.keys(state.faqs.data)});
const mapDispatchToProps = dispatch => ({
  getFaqs: () => dispatch(getFaqs()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Faqs);

const styles = StyleSheet.create({
  iconImage: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  iconArrow: {
    width: 7,
    height: 12,
    resizeMode: 'contain',
  },
  text: {
    color: '#475563',
    fontSize: 14,
    fontFamily: 'Raleway-Bold',
    textTransform: 'uppercase',
  },
  borderBottom: {
    borderBottomColor: '#C8CBD1',
    borderBottomWidth: 0.87,
  },
  noty: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#DC5868',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
    right: 8,
    padding: 0,
  },
  notyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Raleway-Bold',
    marginTop: -3,
  },
});
