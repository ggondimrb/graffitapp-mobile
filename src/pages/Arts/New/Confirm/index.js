import React, {useState} from 'react';
import {View, Platform, Alert} from 'react-native';

import api from '~/services/api';

import {
  ReviewArt,
  TextReviewArtLabel,
  TextReviewArt,
  Container,
  ListImage,
  Image,
  SubmitButton,
} from './styles';

import Background from '~/components/Background';

import Toast from 'react-native-root-toast';

export default function Confirm({route, navigation}) {
  const {graffiti} = route.params;
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  async function handleSubmit() {
    const {
      name,
      description,
      artistName,
      latitude,
      longitude,
      listImage,
    } = graffiti;

    try {
      setLoading(true);
      const response = await api.post('graffitis', {
        name,
        description,
        artist_name: artistName,
        latitude,
        longitude,
      });

      const {id} = response.data;

      Promise.all(
        listImage.map((image) => {
          createImage(image, id);
        }),
      );

      setToast(true);
      setTimeout(() => setToast(false), 10000);
      setLoading(false);
      navigation.navigate('Feed');
    } catch (err) {
      setLoading(false);
      Alert.alert('Erro: ' + err);
    }
  }

  async function createImage(image, id) {
    const data = new FormData();

    try {
      data.append('file', {
        name: image.uri.substr(image.uri.lenght - 10),
        type: 'image/jpg',
        uri:
          Platform.OS === 'android'
            ? image.uri
            : image.uri.replace('file://', ''),
      });

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      await api.post(`files/${id}`, data, headers);
    } catch (err) {
      Alert.alert(err);
    }
  }

  return (
    <Background>
      <Toast
        visible={toast}
        position={50}
        shadow={true}
        shadowColor="#131313"
        animation={false}
        hideOnPress={true}>
        Grafitti adicionado com sucesso!
      </Toast>
      <Container>
        <ReviewArt>
          <TextReviewArtLabel>Nome</TextReviewArtLabel>
          <TextReviewArt>{graffiti.name}</TextReviewArt>

          <TextReviewArtLabel>Descrição</TextReviewArtLabel>
          <TextReviewArt>{graffiti.description}</TextReviewArt>

          <TextReviewArtLabel>Artista</TextReviewArtLabel>
          <TextReviewArt>{graffiti.artistName}</TextReviewArt>

          <TextReviewArtLabel>Localização</TextReviewArtLabel>
          <TextReviewArt>{graffiti.formatted_adress}</TextReviewArt>

          <ListImage
            horizontal={true}
            data={graffiti.listImage}
            keyExtractor={(item) => item.uri}
            renderItem={({item}) => (
              <View>
                <Image
                  source={{
                    uri: item.uri,
                  }}
                />
              </View>
            )}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Adicionar Arte
          </SubmitButton>
        </ReviewArt>
      </Container>
    </Background>
  );
}
