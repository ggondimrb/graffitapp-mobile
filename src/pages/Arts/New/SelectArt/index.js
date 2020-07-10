import React, {useRef, useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {PermissionsAndroid} from 'react-native';

import {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import apiGeolocation from '~/services/apiGeolocation';

import {View, Alert} from 'react-native';

import ImagePicker from 'react-native-image-picker';

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

export default function SelectArt({navigation}) {
  const [listImage, setListImage] = useState([]);
  const descriptionRef = useRef();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [artistName, setArtistName] = useState('');

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

  async function handleSubmit() {
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
        <Form>
          <FormInput
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome"
            numberOfLines={1}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current.focus()}
            value={name}
            onChangeText={setName}
          />
          <FormInput
            autoCorrect={true}
            autoCapitalize="none"
            multiline={true}
            numberOfLines={2}
            placeholder="Descrição"
            ref={descriptionRef}
            returnKeyType="next"
            value={description}
            onChangeText={setDescription}
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

          <FormInput
            icon="palette"
            placeholder="Artista"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={artistName}
            onChangeText={setArtistName}
          />

          <Separator />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Adicionar Arte
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
