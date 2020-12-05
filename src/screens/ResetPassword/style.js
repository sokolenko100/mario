import {StyleSheet, Dimensions} from 'react-native';
import Fonts from '../../utils/fonts';
import Constants from '../../utils/constants';

const styles = StyleSheet.create({
  viewImage: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  viewCenter: {
    flex: 6,
    height: Dimensions.get('window').height - 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgcenter: {
    width: 270,
    height: 226,
    marginBottom: 56,
  },
  textH: {
    color: Constants.dotSelecetedColor,
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: Fonts.Raleway_Bold,
    marginBottom: 14,
  },
  textU: {
    color: Constants.dotSelecetedColor,
    fontSize: 14,
    fontFamily: Fonts.Raleway_Regular,
  },
  textN: {
    color: Constants.dotSelecetedColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Fonts.Raleway_Regular,
    maxWidth: 262,
  },
  form: {
    height: 230,
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: '8%',
    paddingRight: '8%',
    paddingTop: 15,
    alignItems: 'center',
  },
});

export default styles;
