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

export default function Confirm({route, navigation}) {
  const {graffiti} = route.params;
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const {
      name,
      description,
      artistName,
      latitude,
      longitude,
      listImage,
    } = graffiti;

    console.warn(graffiti);

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

      navigation.navigate('Feed');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.alert('Erro: ' + err);
    }
  }

  async function createImage(image, id) {
    const data = new FormData();

    data.append('file', {
      name: image.fileName,
      type: image.type,
      uri:
        Platform.OS === 'android'
          ? image.uri
          : image.uri.replace('file://', ''),
    });

    const headers = {
      'Content-Type': 'multipart/form-data',
    };

    await api.post(`files/${id}`, data, headers);
  }

  return (
    <Background>
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
            keyExtractor={(item) => item.fileName}
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
