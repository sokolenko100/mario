/**
 * File: index.js
 * Project: mariposa
 * File Created: Friday, 5th July 2019 5:20:55 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 1:25:53 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {Content, Container} from 'native-base';
import Header from '../../reusable/header';
import Construction from '../../reusable/construction';

export default class Settings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <Header title={'AJUSTES'} />
        <Content>
          <Construction />
        </Content>
      </Container>
    );
  }
}

// const styles = StyleSheet.create({});
