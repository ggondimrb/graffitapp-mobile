import React, {useRef, useState, useEffect} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {PermissionsAndroid, View, Alert} from 'react-native';

import {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import apiGeolocation from '~/services/apiGeolocation';

import ImagePicker from 'react-native-image-picker';

import ErrorMessage from '~/components/ErrorMessage';
import Background from '~/components/Background';

import {
  Container,
  Separator,
  Form,
  FormInput,
  SubmitButton,
  ListImage,
  TitleAddImage,
  AddImage,
  Image,
  RemoveImage,
  MapArtSelect,
  TitleMapArtSelect,
} from './styles';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Nome')
    .required('Por favor, informe o nome')
    .min(6, 'Nome deve conter no minimo 6 caracteres'),
  description: Yup.string()
    .label('Descrição')
    .required('Por favor, informe a descrição')
    .min(6, 'Descrição deve conter no minimo 6 caracteres '),
  artistName: Yup.string()
    .label('Artista')
    .required('Por favor, informe o nome do artista'),
});

export default function SelectArt({navigation}) {
  const [listImage, setListImage] = useState([]);
  const descriptionRef = useRef();

  const [currentRegion, setCurrentRegion] = useState(null);
  const [marker, setMarker] = useState(null);

  const [loading, setLoading] = useState(false);

  const imagePickerOptions = {
    title: 'Selecione a arte',
    takePhotoButtonTitle: 'Tirar uma foto',
    chooseFromLibraryButtonTitle: 'Escolher da Galeria...',
  };

  useEffect(() => {
    async function loadInitialPosition() {
      navigation.setOptions({
        tabBarVisible: false,
      });

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Localização',
          message: 'Grafitapp precisa acessar sua localização ',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition((position) => {
          const {latitude, longitude} = position.coords;

          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        });
      }
    }

    loadInitialPosition();
  }, []);

  function imagePickerCallback(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      return;
    }

    if (!data.uri) {
      return;
    }

    const imageExists = listImage.some(
      (item) => item.fileName === data.fileName,
    );

    if (imageExists) {
      Alert.alert('Imagem já existe');
    } else {
      const {uri, fileName, type} = data;

      setListImage([...listImage, {uri, fileName, type}]);
    }
  }

  function removeImage(fileName) {
    console.tron.log(fileName);
    setListImage(listImage.filter((item) => item.fileName !== fileName));
  }

  async function handleOnCreate(values, actions) {
    if (!marker) {
      Alert.alert('Localização não selecionada');
    } else if (listImage.length === 0) {
      Alert.alert('Selecione pelo menos uma imagem');
    } else {
      handleSubmitFinal(values);
    }
  }

  async function handleSubmitFinal(values) {
    const {name, description, artistName} = values;
    const {latitude, longitude} = marker;

    const latlng = `${latitude},${longitude}`;

    try {
      setLoading(true);
      const response = await apiGeolocation.get('json', {
        params: {
          latlng,
          key: 'AIzaSyDFFAm6sy5xJlW-yGjE4RraqB5BFNjDHPg',
        },
      });

      const formatted_adress = response.data.results[0].formatted_address;

      const graffiti = {
        name,
        description,
        artistName,
        latitude,
        longitude,
        listImage,
        formatted_adress,
      };

      console.tron.log(graffiti);

      navigation.navigate('Confirm', {graffiti});

      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert('Erro: ' + err);
    }
  }

  function handlePickLocalization(e) {
    const {latitude, longitude} = e.nativeEvent.coordinate;

    setMarker({latitude, longitude});

    console.tron.log(marker);
  }

  return (
    <Background>
      <Container>
        <Formik
          initialValues={{name: '', description: '', artistName: ''}}
          onSubmit={(values, actions) => {
            handleOnCreate(values, actions);
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <FormInput
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Nome"
                numberOfLines={1}
                returnKeyType="next"
                onSubmitEditing={() => descriptionRef.current.focus()}
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
              <FormInput
                icon="info"
                autoCorrect={true}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={2}
                placeholder="Descrição"
                ref={descriptionRef}
                returnKeyType="next"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
              />
              <ErrorMessage
                errorValue={touched.description && errors.description}
              />
              <FormInput
                icon="palette"
                placeholder="Artista"
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                value={values.artistName}
                onChangeText={handleChange('artistName')}
                onBlur={handleBlur('artistName')}
              />
              <ErrorMessage
                errorValue={touched.artistName && errors.artistName}
              />

              <Separator />

              <AddImage
                onPress={() =>
                  ImagePicker.showImagePicker(
                    imagePickerOptions,
                    imagePickerCallback,
                  )
                }>
                <TitleAddImage>Escolher imagem</TitleAddImage>
              </AddImage>
              {listImage.length === 0 && (
                <TitleMapArtSelect>
                  Nenhuma imagem selecionada
                </TitleMapArtSelect>
              )}

              <ListImage
                horizontal={true}
                data={listImage}
                keyExtractor={(item) => item.fileName}
                renderItem={({item}) => (
                  <View>
                    <Image
                      source={{
                        uri: item.uri,
                      }}
                    />
                    <RemoveImage>
                      <Icon
                        name="remove-circle"
                        size={25}
                        color="#f5222d"
                        onPress={() => removeImage(item.fileName)}
                      />
                    </RemoveImage>
                  </View>
                )}
              />

              <Separator />

              <TitleMapArtSelect>Selecione a localização</TitleMapArtSelect>
              <MapArtSelect
                initialRegion={currentRegion}
                showsUserLocation={true}
                onPress={handlePickLocalization}>
                {marker && <Marker coordinate={marker} />}
              </MapArtSelect>

              <Separator />

              <SubmitButton
                disabled={!isValid || isSubmitting}
                loading={loading}
                onPress={handleSubmit}>
                Adicionar Arte
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </Container>
    </Background>
  );
}
