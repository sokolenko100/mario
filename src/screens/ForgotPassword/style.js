import {StyleSheet} from 'react-native';
import Fonts from '../../utils/fonts';
import Constants from '../../utils/constants';
const styles = StyleSheet.create({
  viewCenter: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewInput: {
    width: 290,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#C8CBD1',
  },

  imgcenter: {
    width: 229,
    height: 226,
    marginBottom: 32,
  },
  textH: {
    color: Constants.dotSelecetedColor,
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: Fonts.Raleway_Bold,
    marginBottom: 12,
  },
  textU: {
    color: Constants.dotSelecetedColor,
    fontSize: 14,
    fontFamily: Fonts.Raleway_Bold,
  },
  inputText: {padding: 0, fontSize: 14, fontFamily: Fonts.Raleway_Regular},
  textN: {
    color: Constants.dotSelecetedColor,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 35,
    fontFamily: Fonts.Raleway_Regular,
  },
  textError: {
    color: Constants.errorColor,
    fontSize: 12,
    fontFamily: Fonts.Raleway_SemiBold,
  },
  viewError: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
  },
  form: {
    flex: 4,
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: '8%',
    paddingRight: '8%',
    marginTop: 20,
    alignItems: 'center',
  },
});

export default styles;
