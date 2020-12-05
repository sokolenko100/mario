import React, {Component} from 'react';
import {connect} from 'react-redux';
import t from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import Constants from '../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {
  getPaymentMethodRegisterUrl,
  requestPayment,
  validateRegisterStatus,
} from '../redux/modules/paymentMethod';
// import Checkbox from './checkbox';
import {Spinner} from 'native-base';
import { devlog } from '../utils/log';
const {width} = Dimensions.get('window');

class ModalTerms extends Component {
  static propTypes = {
    visible: t.bool,
    closeModal: t.func,
    hide: t.func,
    getRegisterUrl: t.func,
    success: t.bool,
    error: t.bool,
    loading: t.bool,
  };
  state = {
    checked: 'credit',
    manualSelected: false,
  };
  handleSubmit = () => {
    const {checked} = this.state;
    if (checked === 'credit') {
      return this.handleGetRegisterUrl();
    }
    this.setState({manualSelected: true});
  };
  handleConfirmManual = () => {
    this.setState({manualSelected: false});
    this.props.hide();
  };
  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible && !visible) {
      this.props.navigation.navigate('validate');
    }
  }
  handleGetRegisterUrl = async () => {
    const {getRegisterUrl} = this.props;
    const {url, token} = await getRegisterUrl();
    if (!url || !token) {
      return;
    }
    Linking.openURL(`${url}?token=${token}`);
  };
  setCheckbox = key => () => {
    this.setState({checked: key});
  };
  render() {
    const {visible, error, success, loading, ...props} = this.props;
    const {checked, manualSelected} = this.state;
    devlog({ checked, manualSelected });
    return (
      <>
        <Modal
          isVisible={visible}
          backdropColor="#243142"
          backdropOpacity={0.5}
          {...props}>
          <View style={styles.card}>
            <View
              style={[
                styles.cardHeader,
                error && !success && styles.cardHeaderDanger,
                success && styles.cardHeaderSuccess,
              ]}>
              <Text
                style={[
                  styles.header,
                  error && styles.headerDanger,
                  success && styles.headerSuccess,
                ]}>
                MEDIO DE PAGO
              </Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.body}>
                {success
                  ? 'Medio de pago agregado con éxito'
                  : error
                    ? 'UPS! Algo paso y no quedo registrado tu medio de pago, por favor vuelva a intentarlo.'
                    : 'Para continuar, debes agregar un medio de pago para tu suscripción'}
              </Text>
            </View>
            <View
              style={[
                styles.row,
                {justifyContent: 'center', width: '100%'},
              ]}>
              <TouchableWithoutFeedback onPress={this.setCheckbox('credit')}>
                <View style={styles.col}>
                  <Image
                    source={require('../../assets/images/credito_100.png')}
                    style={[
                      styles.image,
                      {opacity: checked === 'credit' ? 1 : 0.5},
                    ]}
                  />
                  <View style={[styles.row, { height: 15}]}>
                    {/* <Checkbox
                      checked={checked === 'credit'}
                      onCheck={this.setCheckbox('credit')}
                    /> 
                    <Text style={styles.body}>Tarjeta de crédito</Text>
                    */}
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {/* <TouchableWithoutFeedback onPress={this.setCheckbox('manual')}>
                <View style={styles.col}>
                  <Image
                    source={require('../../assets/images/efectivo_100.png')}
                    style={[
                      styles.image,
                      {opacity: checked === 'manual' ? 1 : 0.5},
                    ]}
                  />
                  <View style={styles.row}>
                    <View>
                      <Checkbox
                        checked={checked === 'manual'}
                        onCheck={this.setCheckbox('manual')}
                      />
                    </View>
                    <Text style={styles.body}>Manual</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback> */}
            </View>
            {!success ? (
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={this.handleSubmit}
                  disabled={loading}>
                  <LinearGradient
                    colors={[Constants.themeColor, Constants.gradientlowColor]}
                    style={styles.button}
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 1}}
                    locations={[0, 1]}>
                    <Text style={[styles.buttonText]}>
                      {loading
                        ? 'CARGANDO'
                        : error
                          ? 'REINTENTAR'
                          : 'AGREGAR MEDIO DE PAGO'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {loading && <Spinner color={Constants.themeColor} />}
              </View>
            ) : (
              <Text style={styles.body}>
                Serás redirigido al inicio en 5 segundos
              </Text>
            )}
          </View>
          <Modal
            isVisible={manualSelected}
            backdropColor="#243142"
            backdropOpacity={0.5}
            {...props}>
            <View style={styles.card}>
              <View style={[styles.cardHeader]}>
                <Text style={styles.header}>MEDIO DE PAGO</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.body}>
                Al seleccionar manual como medio de pago, aceptas mes a mes
                pagar presencialmente la cuenta en sencillito o caja vecina.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.action}
                onPress={this.handleConfirmManual}>
                <LinearGradient
                  colors={[Constants.themeColor, Constants.gradientlowColor]}
                  style={styles.button}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  locations={[0, 1]}>
                  <Text style={[styles.buttonText]}>Seleccionar</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.action}
                onPress={() => this.setState({manualSelected: false})}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = ({
  paymentMethod: {requestPayment, error, success, loading},
  auth: {
    data: {tyc},
  },
}) => ({
  visible: requestPayment && tyc,
  error,
  success,
  loading,
});

const mapDispatchToProps = dispatch => ({
  getRegisterUrl: () => dispatch(getPaymentMethodRegisterUrl()),
  hide: () => dispatch(requestPayment(false)),
  validateRegisterStatus: ({token}) =>
    dispatch(validateRegisterStatus({token})),
});

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalTerms),
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.89,
    borderRadius: 11,
    backgroundColor: 'white',
    shadowColor: 'rgba(255,255,255,0.37)',
    shadowOffset: {height: 7, width: 2},
    alignSelf: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fafafa',
    borderTopRightRadius: 11,
    borderTopLeftRadius: 11,
  },
  cardHeaderDanger: {
    backgroundColor: '#dc5868',
  },
  cardHeaderSuccess: {
    backgroundColor: '#58af62',
  },
  header: {
    fontFamily: 'Raleway-Bold',
    fontSize: 18,
    color: '#475563',
    textAlign: 'center',
  },
  headerDanger: {
    color: '#fff',
  },
  headerSuccess: {
    color: '#fff',
  },
  cardBody: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
  body: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#475563',
    textAlign: 'center',
    marginBottom: 10,
  },
  bodyBold: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
    lineHeight: 22,
    color: '#475563',
    textAlign: 'center',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    width: width * 0.68,
    backgroundColor: '#c8cbd1',
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 8
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
  button: {
    flexDirection: 'row',
    width: width * 0.76,
    height: 35,
    backgroundColor: '#4BA4CB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: 'white',
  },
  image: {
    width: width * 0.2663,
    height: 92,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    alignItems: 'center',
  },
});
