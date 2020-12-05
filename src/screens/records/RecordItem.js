/*
 * File: RecordItem.js
 * Project: mariposa
 * File Created: Thursday, 1st August 2019 10:10:50 am
 * Author: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Last Modified: Tuesday, 29th October 2019 3:58:51 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Inventures - www.inventures.cl
 */

import React, {useRef, useState} from 'react';
import t from 'prop-types';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {Text, Card, CardItem, Row, Col, Spinner} from 'native-base';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import {View as AnimatableView} from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import DetailInfo from './DetailInfo';
import {removeTrip, setAddress} from '../../redux/modules/trips';
import Alert from '../../reusable/alert';
import {readableTime} from '../../utils/datetimes';
import Images from '../../utils/images';
import Constants from '../../utils/constants';

const RemoveButton = ({onPress}) => (
  <View style={styles.removeContainer}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.removeButton}>
        <Image
          style={styles.removeIcon}
          source={require('../../../assets/images/trash.png')}
        />
        <Text style={styles.removeText}>ELIMINAR</Text>
      </View>
    </TouchableOpacity>
  </View>
);
RemoveButton.propTypes = {
  onPress: t.func
};
let {width} = Dimensions.get('window');
width = Math.floor(width);

const brandsLogos = {
  haval: require('../../../assets/images/logos_marcas/haval.png'),
  jac: require('../../../assets/images/logos_marcas/jac.png'),
  renault: require('../../../assets/images/logos_marcas/renault.png'),
  suzuki: require('../../../assets/images/logos_marcas/suzuki.png'),
  greatwall: require('../../../assets/images/logos_marcas/greatwall.png'),
  mazda: require('../../../assets/images/logos_marcas/mazda.png'),
  changan: require('../../../assets/images/logos_marcas/changan.png'),
};
const RecordItem = ({
  id,
  startDirection,
  startDate,
  endDirection,
  endDate,
  mapImageUrl,
  distance,
  maxSpeed,
  duration,
  make = '',
  plateNumber,
  remove,
  onClose,
  onOpen,
  oilSpent,
  showPlateNumber,
}) => {
  const card = useRef();
  const swipeable = useRef();
  const animatedView = useRef();
  const [alert, setAlert] = useState(false);
  const toggleAlert = () => setAlert(!alert);
  const handleShare = async () => {
    if (card.current) {
      const uri = await card.current.capture();
      try {
        await Share.open({
          url: `file://${uri}`,
        });
      } catch (e) {
        // console.log(e);
      }
    }
  };
  const handleRemove = async () => {
    toggleAlert();
    swipeable.current.close();
    await animatedView.current.bounceOutLeft(800);
    await animatedView.current.slideInUp(500);
    await remove();
  };
  const handleCancel = () => {
    toggleAlert();
    swipeable.current.close();
  };
  const swipe = () => {
    swipeable.current.openRight();
  };
  const brandLogo = brandsLogos[make.toLowerCase()]
    ? brandsLogos[make.toLowerCase()]
    : require('../../../assets/images/logos_marcas/logo_dercomaq.png');
  return (
    <Swipeable
      containerStyle={{marginTop: -40}}
      renderRightActions={() => <RemoveButton onPress={toggleAlert} />}
      ref={swipeable}
      onSwipeableWillOpen={() => onOpen(id)}
      onSwipeableWillClose={() => onClose(id)}
      style={[Platform.OS === 'ios' && styles.iosFilter]}>
      <AnimatableView ref={animatedView}>
        <ViewShot ref={card} options={{format: 'jpg', quality: 0.9}}>
          <TouchableWithoutFeedback onLongPress={swipe}>
            <Card style={styles.item}>
              <CardItem style={styles.mapBox} cardBody>
                {mapImageUrl ? <FastImage
                  style={styles.map}
                  source={{
                    uri: decodeURIComponent(
                      `${mapImageUrl}&size=${(width - 32 - 60) * 2}x${148 * 2}`,
                    ),
                    priority: FastImage.priority.low,
                  }}
                /> : (
                  
                  <>
                    <Image source={Images.defaultMapBackground} style={styles.map}/>
                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                      <Spinner color={Constants.themeColor} />
                    </View>
                  </>
                )}

                {showPlateNumber && (
                  <View style={styles.plateNumberImage}>
                    <Image
                      source={brandLogo}
                      style={{
                        width: 22,
                        height: 18,
                        resizeMode: 'contain',
                        marginRight: 4,
                      }}
                    />
                    <Text style={styles.plateNumberText}>{plateNumber}</Text>
                  </View>
                )}
              </CardItem>
              <CardItem style={styles.detail} cardBody>
                <Col style={{height: 180}}>
                  <Row style={styles.pathBox}>
                    <Image
                      style={styles.pathIcon}
                      source={require('../../../assets/images/inicio_recorrido.png')}
                    />
                    <Text
                      style={
                        styles.pathText
                      }>{`${startDirection} (${readableTime(
                        startDate,
                      )})`}</Text>
                  </Row>
                  <Row style={styles.pathBox}>
                    <Image
                      style={styles.pathIcon}
                      source={require('../../../assets/images/fin_recorrido.png')}
                    />
                    <Text
                      style={styles.pathText}>{`${endDirection} (${readableTime(
                        endDate,
                      )})`}</Text>
                  </Row>
                  <View style={styles.line} />
                  <Row>
                    <DetailInfo
                      source={require('../../../assets/images/distancia.png')}
                      text={`${distance} km`}
                    />
                    {oilSpent && (
                      <DetailInfo
                        source={require('../../../assets/images/bencina.png')}
                        text={`$${oilSpent}`}
                      />
                    )}
                    <DetailInfo
                      source={require('../../../assets/images/velocidad.png')}
                      text={`${maxSpeed} km/h`}
                    />
                    <DetailInfo
                      source={require('../../../assets/images/tiempo.png')}
                      text={`${duration} m`}
                    />
                  </Row>
                </Col>
              </CardItem>
              <CardItem style={styles.footer} cardBody>
                <TouchableOpacity style={styles.share} onPress={handleShare}>
                  <Image
                    style={styles.shareIcon}
                    source={require('../../../assets/images/compartir.png')}
                  />
                  <Text style={styles.shareText}>COMPARTIR VIAJE</Text>
                </TouchableOpacity>
              </CardItem>
              <View style={styles.test} />
            </Card>
          </TouchableWithoutFeedback>
        </ViewShot>
      </AnimatableView>
      <Alert
        danger
        header="ELIMINAR VIAJE"
        body="Esta seguro que desea eliminar este viaje? Esta acción es irreversible"
        actions={[
          {text: 'CANCELAR', onPress: handleCancel},
          {text: 'ELIMINAR', main: true, onPress: handleRemove},
        ]}
        visible={alert}
        closeModal={toggleAlert}
      />
    </Swipeable>
  );
};
RecordItem.propTypes = {
  id: t.number.isRequired,
  startDirection: t.string.isRequired,
  startDate: t.string.isRequired,
  endDirection: t.string.isRequired,
  endDate: t.string.isRequired,
  mapImageUrl: t.string.isRequired,
  distance: t.number.isRequired,
  oilSpent: t.number,
  maxSpeed: t.number.isRequired,
  duration: t.number.isRequired,
  setAddress: t.func.isRequired,
  remove: t.func.isRequired,
  make: t.string,
  plateNumber: t.string,
  onClose: t.func,
  onOpen: t.func,
  showPlateNumber: t.bool,
};

const styles = {
  mapMarker: {
    height: 15,
    width: 5,
  },
  item: {
    backgroundColor: 'white',
    width: width - 32 - 60,
    borderRadius: 14,
    height: 148 + 180 + 19.5 + 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    // shadowOpacity: 0.41,
    // shadowRadius: 9.11,
    // elevation: 1,
    marginBottom: 30,
    marginLeft: 60,
    marginRight: 32,
  },
  map: {
    height: '100%',
    width: '100%',
    // borderRadius: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  mapBox: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 148,
  },
  plateNumberImage: {
    height: 26,
    borderRadius: 12,
    backgroundColor: '#475563',
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    position: 'absolute',
    top: 13,
    left: 10,
    zIndex: 100,
    elevation: 10,
  },
  plateNumberText: {
    color: '#fff',
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    marginTop: 0,
  },
  detail: {
    margin: 13,
  },
  pathIcon: {
    height: 14,
    width: 12,
    resizeMode: 'contain',
    marginRight: 8,
    marginTop: 5,
  },
  pathText: {
    color: '#475563',
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    marginRight: 13,
  },
  line: {
    borderWidth: 0.5,
    width: '100%',
    borderColor: '#c8cbd1',
    marginVertical: 18,
  },
  footer: {
    borderRadius: 14,
  },
  user: {
    backgroundColor: '#f4f4f4',
    borderBottomLeftRadius: 14,
    paddingTop: 8,
    paddingBottom: 12,
    height: 53,
    flex: 1,
  },
  driver: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 15,
  },
  profilePhoto: {
    width: 28,
    height: 28,
    marginRight: 7.94,
  },
  driverName: {
    fontFamily: 'Raleway-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: '#475563',
    marginTop: 0,
  },
  driverTitle: {
    fontFamily: 'Raleway-Bold',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 2,
    color: '#475563',
  },
  share: {
    backgroundColor: '#4BA4CB',
    width: '100%',
    height: 40,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shareIcon: {
    height: 13,
    width: 13,
    marginRight: 7,
    resizeMode: 'contain',
  },
  shareText: {
    fontSize: 15,
    fontFamily: 'Raleway-Bold',
    color: 'white',
    marginTop: 0,
  },
  removeButton: {
    backgroundColor: '#B70016',
    width: 83,
    height: 83,
    borderRadius: 83 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeContainer: {
    width: 147,
    marginBottom: 40,
    marginTop: -25,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  removeIcon: {
    height: 29.24,
    width: 26.21,
  },
  removeText: {
    height: 11,
    width: 81,
    color: '#FFFFFF',
    fontFamily: 'Raleway-Bold',
    fontSize: 10,
    lineHeight: 11,
    textAlign: 'center',
  },
  iosFilter: {
    zIndex: 0,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    // borderRadius: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    shadowOpacity: 0.4,
    elevation: 1.5,
    marginTop: 5,
    marginBottom: 5,
    shadowRadius: 1,
  },
  pathBox: {
    minHeight: 11,
  },
};

const mapStateToProps = (state, {id}) => {
  const trip = state.trips.data[id] || {};
  const tripDetail = state.tripsDetail.data[id] || {};
  const carInfo =
    Object.values(state.cars.data).find(
      car => car.voucherId === trip.voucherId,
    ) || {};
  const showPlateNumber =
    Object.values(state.cars.data).filter(car => car.voucherId).length > 1;
  return {
    ...trip,
    ...tripDetail,
    ...carInfo,
    showPlateNumber,
  };
};

const mapDispatchToProps = (dispatch, {id}) => ({
  remove: () => dispatch(removeTrip({id})),
  setAddress: id => dispatch(setAddress(id)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecordItem);
