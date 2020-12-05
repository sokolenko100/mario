import {StyleSheet} from 'react-native';
import Fonts from '../../utils/fonts';
import Constants from '../../utils/constants';
const styles = StyleSheet.create({
  textH: {
    color: Constants.dotSelecetedColor,
    fontSize: 18,
    padding: 15,
    fontFamily: Fonts.Raleway_Bold,
  },
  textN: {
    color: Constants.dotSelecetedColor,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Fonts.Raleway_Regular,
  },
  imgcenter: {
    width: Constants.dimen.scraWidth - 150,
    height: Constants.dimen.scraWidth - 150,
  },

  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
