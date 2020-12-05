/*
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 19th August 2019 3:42:53 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Saturday, 9th November 2019 12:08:48 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import {Container, Content} from 'native-base';
import Header from '../../reusable/header';
import Constants from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import {openTerms, closeTerms} from '../../redux/modules/localState';
import {acceptTerms} from '../../redux/modules/auth';
import t from 'prop-types';

const {width} = Dimensions.get('window');

class Terms extends Component {
  constructor(props) {
    super(props);
    if (props.accepted) {
      return;
    }
    this._didFocusSubscription = props.navigation.addListener('didFocus', () =>
      BackHandler.addEventListener('hardwareBackPress', () => true),
    );
  }

  componentDidMount() {
    const {openTerms, accepted, navigation} = this.props;
    openTerms();
    if (accepted) {
      return;
    }
    this._willBlurSubscription = navigation.addListener('willBlur', () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true),
    );
  }
  componentWillUnmount() {
    this.props.closeTerms();
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }
  handleCloseModal = () => {
    this.setState({openModal: false});
  };
  handleAcceptTerms = async () => {
    const {navigation, acceptTerms} = this.props;
    await acceptTerms();
    navigation.navigate('login');
  };
  render() {
    const {accepted} = this.props;
    return (
      <Container>
        <Header
          title={'TÉRMINOS Y CONDICIONES'}
          withBack={accepted}
          navigation={this.props.navigation}
        />
        <Content>
          <View style={styles.container}>
            <Text style={styles.textBold}>PRIMERO: ANTECEDENTES</Text>
            <Text style={styles.text}>
              i) DercoCenter es una sociedad anónima cerrada cuyo giro principal
              es la comercialización de vehículos motorizados, así como a la
              prestación de servicios asociados a la prestación de dicha
              comercialización.{' '}
            </Text>
            <Text style={styles.text}>
              ii) Dentro de dicho contexto comercial, DercoCenter está
              desarrollando una plataforma de servicios denominada “MI AUTO
              DIGITAL” mediante la cual ofrece a quienes se afilien a dicha
              plataforma, servicios de asistencia vial proactiva. Para tales
              efectos, se entiende por servicios de asistencia vial proactiva a
              aquellos servicios que, a través de recursos humanos, técnicos y
              tecnológicos dispuestos por DercoCenter, brinden a sus afiliados
              una pronta atención en caso que experimenten eventos relacionados
              a accidentes, averías y otras situaciones que requieran un apoyo
              de emergencia, durante su experiencia conductiva en vías chilenas,
              todo ello de acuerdo a las condiciones y limitaciones previstas en
              este Contrato, así como a las actualizaciones, ajustes y
              modificaciones que sean aplicables de tiempo en tiempo.{' '}
            </Text>
            <Text style={styles.text}>
              iii) Para tales efectos, el servicio MI AUTO DIGITAL considera la
              instalación gratuita de un dispositivo telemático de seguridad en
              los Vehículos, según este concepto se define más adelante (el o
              los “Dispositivos Telemáticos”), así como el uso de tecnologías y
              aplicaciones telemáticas complementarias a dichos dispositivos,
              necesarios para la operación del servicio MI AUTO DIGITAL las 24
              horas del día, los 365 días del año. Lo anterior, en todo caso, se
              debe entender sin perjuicio de las limitaciones y restricciones en
              el funcionamiento del servicio ofrecido que se convienen en este
              instrumento.{' '}
            </Text>
            <Text style={styles.text}>
              iv) El Dispositivo Telemático, deberá ser mantenido en la forma y
              oportunidad que regula el presente Contrato.{' '}
            </Text>
            <Text style={styles.text}>
              v) El servicio MI AUTO DIGITAL tiene por finalidad producir una
              mejora cualitativa en la experiencia conductiva de los clientes de
              DercoCenter, a través del acceso a un sistema de asistencia vial
              proactiva de última generación. Debido a ello, se deja expresa
              constancia que el acceso a los servicios MI AUTO DIGITAL está
              reservado en forma exclusiva a aquellos clientes de DercoCenter
              que se afilien a MI AUTO DIGITAL, mediante la suscripción del
              presente Contrato, aceptando los términos y condiciones para su
              aplicación, y únicamente en referencia a el o los Vehículos de
              propiedad del Afiliado que sean registrados en el servicio de MI
              AUTO DIGITAL. Lo anterior, en todo caso, se debe entender sin
              perjuicio del uso de los servicios objeto de este Contrato por
              parte de Beneficiarios que sean ocupantes del Vehículo sujeto al
              servicio MI AUTO DIGITAL.{' '}
            </Text>
            <Text style={styles.text}>
              vi) Atendido que en la actualidad la aplicación del servicio MI
              AUTO DIGITAL se encuentra en una etapa de desarrollo, sus
              beneficios son ofrecidos por el plazo de tiempo que determine
              unilateralmente DercoCenter sin costos para el Afiliado. Sin
              perjuicio de ello, una vez cumplido el Período de Inicio, según
              este concepto se define más adelante, DercoCenter se reserva el
              derecho de fijar cobros relacionados a uno o más servicios MI AUTO
              DIGITAL. En todo caso, en caso que DercoCenter fije tales cobros,
              ellos sólo serán aplicables al Afiliado siempre que previamente
              haya sido informado y aceptado tales cobros. En caso que el
              Afiliado rechace tales cobros o no se pronuncie dentro del plazo
              respectivo, se entenderá, por ese solo hecho, que el Afiliado ha
              rechazado tales cobros y ha convenido con DercoCenter en poner
              término inmediato al presente Contrato, sin ulterior
              responsabilidad para ninguna de las Partes.{' '}
            </Text>
            <Text style={styles.text}>
              vii) El Afiliado declara que ha sido informado adecuadamente de lo
              anterior y de todos los alcances del servicio MI AUTO DIGITAL así
              como, de las obligaciones, límites y restricciones que le confiere
              el presente Contrato, y que está interesado en contratar los
              servicios respectivos en el marco establecido por el presente
              Contrato.
            </Text>
            <Text style={styles.textBold}>
              SEGUNDO: DEFINICIONES E INTERPRETACIÓN
            </Text>
            <Text style={styles.text}>
              2.1 Las definiciones utilizadas en el presente Contrato y su
              Anexo, se identificarán mediante mayúsculas en la primera letra de
              cada palabra principal, y en cada caso, tendrán el siguiente
              sentido, salvo que de su contexto sea claro que las Partes han
              querido darle un sentido distinto: (a) Accidente: Todo
              acontecimiento extraordinario, imprevisible, irresistible y
              violento que provoque, de manera visible, daños materiales y/o
              corporales a un Afiliado o a los Beneficiarios, durante la
              vigencia del presente Contrato. (b) Accidente de Gravedad.
              Cualquier Accidente caracterizado por una desaceleración del
              Vehículo superior a 6 en Fuerza Física G.; (c) Accidente Mediano:
              Cualquier Accidente caracterizado por una desaceleración del
              Vehículo entre 2,5 y 6 en Fuerza Física G.;
            </Text>
          </View>
        </Content>
        {!accepted ? (
          <View style={styles.buttonFloating}>
            <TouchableOpacity onPress={this.handleAcceptTerms}>
              <LinearGradient
                colors={[Constants.themeColor, Constants.gradientlowColor]}
                style={styles.button}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                locations={[0, 1]}>
                <Text style={styles.buttonText}>ACEPTAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : null}
      </Container>
    );
  }
}
Terms.propTypes = {
  accepted: t.boolean,
  openTerms: t.func,
  closeTerms: t.func,
  acceptTerms: t.func,
};
const mapStateToprops = ({
  auth: {
    data: {tyc},
  },
}) => ({
  accepted: tyc,
});

const mapDispatchToProps = dispatch => {
  return {
    openTerms: () => dispatch(openTerms()),
    closeTerms: () => dispatch(closeTerms()),
    acceptTerms: () => dispatch(acceptTerms()),
  };
};


export default connect(
  mapStateToprops,
  mapDispatchToProps,
)(Terms);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  textBold: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    textAlign: 'justify'
  },
  buttonFloating: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  button: {
    width: width * 0.76,
    height: 35,
    backgroundColor: '#4BA4CB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: 'white',
  },
});
