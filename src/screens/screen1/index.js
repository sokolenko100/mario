/**
 * File: index.js
 * Project: mariposa
 * File Created: Monday, 1st July 2019 5:45:22 pm
 * Author: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Last Modified: Friday, 12th July 2019 1:23:10 pm
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Button, Text} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';
// import Fingerprint from '../../reusable/auth/fingerprint';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      avatarSource: '',
      location: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  componentDidMount() {
    /**
     * FIXME: navigator is not defined
     */
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     console.log(position);
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       error: null
    //     });
    //   },
    //   error => this.setState({ error: error.message }),
    //   { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 }
    // );
  }

  async requestExternalStoreageRead() {
    try {
      /**
       * FIXME:
       */
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool App ...',
          message: 'App needs access to external storage',
        },
      );
      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      //Handle this error
      return false;
    }
  }

  checkData() {
    if (
      this.state.email === 'hpineroo@gmail.com' &&
      this.state.password === '123456'
    ) {
      this.props.navigation.navigate('c2');
    } else {
      // this.props.navigation.navigate('c2');
    }
  }

  loadCamera() {
    const options = {
      title: 'Selecciona Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        /**
         * FIXME: use early return
         */
        // console.log(source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }

  render() {
    return (
      <View>
        {/* <Fingerprint /> */}
        <Image
          source={this.state.avatarSource}
          style={{width: 50, height: 50}}
        />
        <Text> Login </Text>
        <TextInput
          value={this.state.email}
          onChangeText={email => this.setState({email})}
        />
        <TextInput
          value={this.state.password}
          secureTextEntry
          onChangeText={password => this.setState({password})}
        />
        <Button block success onPress={() => this.checkData()}>
          <Text>Login</Text>
        </Button>
        <Button block success onPress={() => this.loadCamera()}>
          <Text>Camera</Text>
        </Button>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            // onMapReady={message => console.log(message)}
            loadingEnabled={true}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={this.state.location}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 300,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
