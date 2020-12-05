import {StyleSheet, Dimensions} from 'react-native';
import Fonts from '../../utils/fonts';
import Constants from '../../utils/constants';
const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 9999,
  },
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 176,
    height: 136,
    marginBottom: 180,
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
  inputText: {padding: 0, fontSize: 14, fontFamily: Fonts.Raleway_Regular, color: 'black'},
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
    marginTop: 10,
    height: 20,
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
