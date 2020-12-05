/*
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 5:39:06 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Tuesday, 29th October 2019 6:20:37 pm
 * Modified By: Gabriel Ulloa (gabriel@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createBottomTabNavigator,
  NavigationActions,
} from 'react-navigation';
import Screen1 from './screens/screen1';
import Screen2 from './screens/screen2';
import Profile from './screens/profile';
import Home from './screens/home';
import Settings from './screens/settings';
import Records from './screens/records';
import FooterMenu from './reusable/footer';
import LoginScreen from './screens/Login';
import {
  ForgotPasswordScreen,
  RequestCreateUser,
  ExpiredInitialPasswordToken,
  ExpiredResetPasswordToken,
} from './screens/ForgotPassword';
import ResetPasswordScreen from './screens/ResetPassword';
import intro from './screens/intro';
import Faqs from './screens/faqs';
import Notifications from './screens/notifications';
import Terms from './screens/terms';
import MoreOptions from './screens/moreOptions';
import ActivationProcess from './screens/activationProcess';
import MiAuto from './screens/miAuto';
import ValidateAuth from './screens/ValidateAuth';
import {RecoverPassword, CreateUserPassword} from './screens/CreatePassword';
import {handleDynamicLink} from './utils/dynamicLinks';
import FaqsCategory from './screens/faqs/category';
import Filter from './screens/records/FilterHeader/Filter/';

const OptionsNavigation = createStackNavigator(
  {
    moreOptions: MoreOptions,
    profile: Profile,
    settings: Settings,
    faqs: Faqs,
    faqsCategory: FaqsCategory,
    notifications: Notifications,
    terms: Terms,
  },
  {
    initialRouteName: 'moreOptions',
    headerMode: 'none',
  },
);
OptionsNavigation.navigationOptions = ({navigation}) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};
const RecordNavigation = createStackNavigator(
  {
    initialRecord: Records,
    filter: Filter,
  },
  {
    initialRouteName: 'initialRecord',
    headerMode: 'none',
  },
);
RecordNavigation.navigationOptions = ({navigation}) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};
const AppNavigation = createBottomTabNavigator(
  {
    home: {screen: Home, path: 'home'},
    services: MiAuto,
    records: RecordNavigation,
    options: OptionsNavigation,
  },
  {
    initialRouteName: 'home',
    tabBarComponent: FooterMenu,
    lazy: false,
  },
);

const LoginNavigation = createStackNavigator(
  {
    Login: LoginScreen,
    ForgotPassword: ForgotPasswordScreen,
    ResetPassword: ResetPasswordScreen,
    RequestCreateUser: RequestCreateUser,
    ExpiredInitialPasswordToken,
    ExpiredResetPasswordToken,
    intro,
    activation: ActivationProcess,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  },
);

class LoginNavigationScreen extends React.PureComponent {
  static router = LoginNavigation.router;
  render() {
    return (
      <View style={{flex: 1}}>
        <LoginNavigation navigation={this.props.navigation} />
      </View>
    );
  }
}

const RootStack = createSwitchNavigator(
  {
    app: {screen: AppNavigation, path: 'app'},
    login: {screen: LoginNavigationScreen, path: 'auth'},
    validate: {screen: ValidateAuth, path: 'validate'},
    createPassword: {screen: RecoverPassword, path: 'nueva-contrasena'},
    createUser: {screen: CreateUserPassword, path: 'nuevo-usuario'},
    c1: Screen1,
    c2: Screen2,
  },
  {
    initialRouteName: 'validate',
    headerMode: 'none',
  },
);

const App = createAppContainer(RootStack);
const prefix = 'autoconectado://';

const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // Dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};
export default () => {
  const navigator = useRef();
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => !!state.auth.data.uuid);
  useEffect(() => {
    if (navigator.current) {
      handleDynamicLink({navigator: navigator.current, dispatch});
    }
  }, []);
  useEffect(() => {
    if (!loggedIn && navigator.current)
      navigator.current.dispatch(
        NavigationActions.navigate({routeName: 'login'}),
      );
  }, [loggedIn]);
  return (
    <App
      ref={navigator}
      uriPrefix={prefix}
      onNavigationStateChange={(prevState, currentState) => {
        const currentScreen = getActiveRouteName(currentState);
        const prevScreen = getActiveRouteName(prevState);
        if (prevScreen !== currentScreen) {
          analytics().setCurrentScreen(currentScreen);
        }
      }}
    />
  );
};
