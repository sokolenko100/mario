import {StyleSheet} from 'react-native';
import Fonts from './fonts';
const Styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
    fontFamily: Fonts.Raleway_SemiBold,
  },
  buttonHeiglight: {
    height: 38,
    borderRadius: 10,
  },
  buttonView: {
    marginTop: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  LinearGradientStyle: {
    height: 36,
    width: 288,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  topCornerImage: {
    width: 169,
    height: 159,
    position: 'absolute',
    top: -10,
    right: 0,
    zIndex: 1,
  },
  bottomLeftImage: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    width: 302 / 2,
    height: 276 / 2,
  },
  touchbackButton: {
    width: '100%',
    // height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10,
  },
  backButtonText: {
    color: '#475563',
    fontSize: 10,
    fontFamily: Fonts.Raleway_Bold,
  },
  imgBack: {
    width: 7,
    height: 12,
    marginLeft: 15,
    marginRight: 5,
  },
});

export default Styles;
