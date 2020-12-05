/*
 * File: category.js
 * Project: mariposa
 * File Created: Thursday, 8th August 2019 9:55:54 am
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 12:44:08 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Text, StyleSheet, Image} from 'react-native';
import {Content, Container, Accordion, View} from 'native-base';
import Header from '../../reusable/header';
import t from 'prop-types';
class FaqsCategory extends Component {
  constructor(props) {
    super(props);
  }


  _renderHeader(item, expanded) {
    return (
      <View
        style={[
          styles.headerFaq,
          {
            borderBottomWidth: expanded ? 0 : 1,
          },
        ]}>
        <Text style={styles.headerText}> {item.title}</Text>
        {expanded ? (
          <Image
            style={styles.arrow}
            source={require('../../assets/imgs/open-faq.png')}
          />
        ) : (
          <Image
            style={styles.arrow}
            source={require('../../assets/imgs/close-faq.png')}
          />
        )}
      </View>
    );
  }

  _renderContent(item) {
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: '#C8CBD1',
        }}>
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
    );
  }
  render() {
    const category = this.props.navigation.getParam('category');
    return (
      <Container>
        <Header title={category} withBack navigation={this.props.navigation} />

        <Content>
          <View style={styles.faqContainer}>
            <Accordion
              expanded={0}
              dataArray={this.props.data}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
              style={{borderWidth: 0}}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

FaqsCategory.propTypes = {
  data: t.any,
};
const mapStateToProps = (state, props) => {
  const category = props.navigation.getParam('category');
  return {
    data: state.faqs.data[category],
  };
};

export default connect(mapStateToProps)(FaqsCategory);

const styles = StyleSheet.create({
  faqContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  headerFaq: {
    flexDirection: 'row',
    paddingVertical: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#C8CBD1',
  },
  headerText: {
    fontSize: 14,
    color: '#475563',
    fontFamily: 'Raleway-Bold',
  },
  contentText: {
    fontSize: 14,
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    paddingBottom: 30,
  },
  arrow: {
    width: 12,
    height: 20,
    resizeMode: 'contain',
  },
});
