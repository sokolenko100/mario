/*
 * File: index.js
 * Project: mariposa
 * File Created: Wednesday, 3rd July 2019 2:33:09 pm
 * Author: Hector Piñero (hector@inventures.cl)
 * -----
 * Last Modified: Tuesday, 22nd October 2019 11:52:00 am
 * Modified By: Felipe Rojos Almuna (felipe@inventures.cl)
 * -----
 * Copyright 2019 - 2019 Incrementa Ventures SpA. ALL RIGHTS RESERVED
 * Terms and conditions defined in license.txt
 * -----
 * Inventures - www.inventures.cl
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import Header from '../../reusable/header';
import {Content, Container, Thumbnail, Form, Toast, Spinner} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import InputApp from '../../reusable/input';
import ImageResizer from 'react-native-image-resizer';
import {
  getUserInfo,
  updateUser,
  updatePictureUser,
  logoutAction,
} from '../../redux/modules/auth';

import Constants from '../../utils/constants';
import uuidv4 from 'uuid/v4';
import AvatarPlaceholder from '../../reusable/avatarPlaceholder';
import t from 'prop-types';
const {width} = Dimensions.get('window');
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      name: '...',
      lastname: '...',
      address: '...',
      phone: '...',
      email: '...',
      dni: '...',
      birthDate: '...',
      avatarSource: '',
      uploadingPicture: false,
    };
  }
  static propTypes = {
    name: t.string,
    lastname: t.string,
    address: t.string,
    phone: t.string,
    email: t.string,
    dni: t.string,
    birthDate: t.string,
    avatarSource: t.string,
    loading: t.bool,
    getInfo: t.func,
    updateProfilePicture: t.func,
    updateUser: t.func,
  }
  static getDerivedStateFromProps(
    {
      name,
      address,
      phone,
      email,
      dni,
      birthDate,
      avatarSource,
      loading,
      lastname,
    },
    {loaded},
  ) {
    if (loading) {
      return {loaded: false};
    }
    if (!loaded) {
      return {
        loaded: true,
        name,
        lastname,
        address,
        phone,
        email,
        dni,
        birthDate,
        avatarSource,
      };
    }
    return null;
  }

  async componentDidMount() {
    const {getInfo} = this.props;
    getInfo();
  }

  loadCamera() {
    const options = {
      title: 'Selecciona Avatar',
      takePhotoButtonTitle: 'Tomar una foto',
      chooseFromLibraryButtonTitle: 'Escoger una foto de tu galería',
      cancelButtonTitle: 'Cancelar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async image => {
      if (image.didCancel) {
        // console.log('User cancelled image picker');
      } else if (image.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (image.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        /**
         * FIXME: replace with early return
         */
        const source = image.uri;
        // console.log(source);
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        try {
          const {uri} = await ImageResizer.createResizedImage(
            source,
            400,
            400,
            'JPEG',
            100,
            0,
          );
          const {updateProfilePicture} = this.props;
          this.setState({uploadingPicture: true});
          await updateProfilePicture({
            uri,
            name:
              Platform.OS === 'ios'
                ? `${uuidv4()}-profilePic.jpg`
                : image.fileName,
            type: image.type,
          });

          Toast.show({
            text: 'Datos guardados',
            buttonText: '',
            duration: 1500,
            type: 'success',
            position: 'top',
          });
        } catch (e) {
          Toast.show({
            text: 'No se pudo guardar la foto. Intente nuevamente',
            buttonText: '',
            duration: 1500,
            type: 'danger',
            position: 'top',
          });
        } finally {
          this.setState({uploadingPicture: false});
        }
      }
    });
  }

  handleValueChange = (name, value) => {
    this.setState({[name]: value});
  };
  updateUser = async ({telephone, address}) => {
    const {updateUser} = this.props;
    try {
      await updateUser({telephone, address});
      Toast.show({
        text: 'Datos guardados',
        buttonText: '',
        duration: 1500,
        type: 'success',
        position: 'top',
      });
    } catch (e) {
      Toast.show({
        text: 'Error al intentar actualizar sus datos. Intente de nuevo',
        buttonText: '',
        duration: 1500,
        type: 'danger',
        position: 'top',
      });
    }
  };

  handleEndValueChange = () => {
    const {phone: telephone, address} = this.state;
    this.updateUser({telephone, address});
  };

  // TODO: Touchable iOS
  render() {
    const {uploadingPicture} = this.state;
    const {name = 'N', lastname = 'N'} = this.state;
    return (
      <Container>
        <Header title={'PERFIL'} withBack navigation={this.props.navigation} />
        <Content>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => this.loadCamera()}>
              <View>
                {uploadingPicture ? (
                  <Spinner color={Constants.themeColor} />
                ) : (
                  <>
                    {this.state.avatarSource ? (
                      <Thumbnail
                        large
                        style={styles.avatar}
                        onPress={() => this.loadCamera()}
                        source={
                          this.state.avatarSource === ''
                            ? require('../../../assets/images/imagen_avatar.png')
                            : {uri: this.state.avatarSource}
                        }
                      />
                    ) : (
                      <AvatarPlaceholder
                        initials={`${name[0]}${lastname[0]}`}
                      />
                    )}

                    <Image
                      style={styles.editAvatar}
                      source={require('../../../assets/images/boton_editar.png')}
                    />
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
            <View>
              <Form>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>Nombre</Text>
                  <InputApp
                    name={'NOMBRE'}
                    value={this.state.name}
                    inputKey={'name'}
                    type={'default'}
                    disabled
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>Apellido</Text>
                  <InputApp
                    name={'APELLIDO'}
                    value={this.state.lastname}
                    inputKey={'lastname'}
                    type={'default'}
                    disabled
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>Dirección</Text>
                  <InputApp
                    name={'DIRECCIÓN'}
                    value={this.state.address ? this.state.address : ''}
                    inputKey={'address'}
                    type={'default'}
                    onValueChange={this.handleValueChange}
                    disabled
                    onFinalValueChange={this.handleEndValueChange}
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>TELÉFONO CONTACTO</Text>
                  <InputApp
                    name={'TELEFONO CONTACTO'}
                    value={this.state.phone}
                    inputKey={'phone'}
                    type={'phone-pad'}
                    onValueChange={this.handleValueChange}
                    disabled={false}
                    onFinalValueChange={this.handleEndValueChange}
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>Correo</Text>
                  <InputApp
                    name={'CORREO'}
                    inputKey={'email'}
                    value={this.state.email}
                    onValueChange={this.handleValueChange}
                    type={'default'}
                    disabled
                    onFinalValueChange={this.handleEndValueChange}
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>rut</Text>
                  <InputApp
                    name={'RUT'}
                    inputKey={'dni'}
                    value={this.state.dni}
                    onValueChange={this.handleValueChange}
                    type={'default'}
                    disabled
                    onFinalValueChange={this.handleEndValueChange}
                    align={'left'}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.inputTitle}>fecha de nacimiento</Text>
                  <InputApp
                    name={'FECHA NACIMIENTO'}
                    inputKey={'birthday'}
                    value={this.state.birthDate}
                    onValueChange={this.handleValueChange}
                    type={'default'}
                    disabled
                    onFinalValueChange={this.handleEndValueChange}
                    align={'left'}
                  />
                </View>
              </Form>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({
  auth: {
    data: {
      address,
      avatar,
      birthDate,
      dni,
      email,
      firstName,
      lastName,
      telephone,
    },
    loading,
  },
}) => {
  const date = new Date(birthDate);
  const formattedBirthDate = `${date.getDate()} - ${date.getMonth()} - ${date.getFullYear()}`;
  return {
    name: firstName,
    lastname: lastName,
    address,
    email,
    phone: telephone ? telephone : '+569',
    dni,
    birthDate: formattedBirthDate ? formattedBirthDate : '',
    avatarSource: avatar,
    loading,
  };
};
const mapDispatchToProps = dispatch => ({
  getInfo: () => dispatch(getUserInfo()),
  updateUser: data => dispatch(updateUser(data)),
  updateProfilePicture: data => dispatch(updatePictureUser(data)),
  logout: () => dispatch(logoutAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);

const styles = StyleSheet.create({
  avatar: {
    width: 125,
    height: 125,
    marginTop: 30,
    borderRadius: 125 / 2,
    marginBottom: 24,
  },
  editAvatar: {
    width: 26,
    height: 26,
    position: 'absolute',
    top: 30,
    right: 15,
    resizeMode: 'contain',
  },
  container: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  logout: {
    justifyContent: 'center',
    marginTop: 50,
    textAlign: 'center',
  },
  logoutText: {
    color: '#B70016',
    textDecorationLine: 'underline',
    fontFamily: 'Raleway-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    width: width * 0.88,
    marginBottom: 20,
  },
  inputTitle: {
    textTransform: 'uppercase',
    color: '#475563',
    fontFamily: 'Raleway-Bold',
    fontSize: 12,
    marginBottom: 4,
  },
});
