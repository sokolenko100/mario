import {StyleSheet} from 'react-native';
import Fonts from '../../utils/fonts';
import Constants from '../../utils/constants';
const styles = StyleSheet.create({
  viewImage: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 176,
    height: 136,
    marginBottom: 64,
    marginTop: 60,
  },
  textH: {
    color: Constants.dotSelecetedColor,
    fontSize: 16,
    fontFamily: Fonts.Raleway_Bold,
    marginBottom: 42,
  },
  textU: {
    color: '#475563',
    fontSize: 12,
    fontFamily: Fonts.Raleway_Bold,
  },
  inputText: {padding: 0, fontSize: 14, fontFamily: Fonts.Raleway_Regular},
  viewContainer: {
    width: '100%',
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#C8CBD1',
  },
  touchshow: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
  touchForget: {
    width: '100%',
    height: 40,
    justifyContent: 'flex-end',
  },
  textForget: {
    color: Constants.themeColor,
    fontSize: 10,
    fontFamily: Fonts.Raleway_Bold,
  },
  textError: {
    color: Constants.errorColor,
    fontSize: 10,
    fontFamily: Fonts.Raleway_Bold,
  },
  viewError: {
    width: '100%',
    height: 40,
    textAlign: 'left',
    justifyContent: 'center',
  },
  form: {
    flex: 5,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 46,
    paddingTop: 15,
    alignItems: 'center',
  },
});

export default styles;
