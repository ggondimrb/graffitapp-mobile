import React, {useEffect, useState} from 'react';
import {Modal, Alert, Linking} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/Feather';

import {SliderBox} from 'react-native-image-slider-box';

import api from '~/services/api';

import apiGeolocation from '~/services/apiGeolocation';

import {
  Container,
  GraffitiView,
  GraffitiTitle,
  GraffitiDescription,
  GraffitiActions,
} from './styles';

import Background from '~/components/Background';
import ButtonAction from '~/components/ButtonAction';

import {getWidthWindow} from '~/util/dimensions';

export default function GraffitiProfile({route}) {
  const {graffiti, images} = route.params;
  const [formattedAdress, setFormattedAdress] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState('');
  const [imagesUrl, setImagesUrl] = useState([]);
  const [imageHeight, setImageHeight] = useState('');
  const [like, setLike] = useState(false);

  useEffect(() => {
    async function loadLike() {
      const response = await api.get(`like/${graffiti.id}`);

      if (response.data) {
        setLike(true);
      }
    }

    async function loadFormattedAdress() {
      images.forEach((image) => {
        imagesUrl.push({url: image});
      });

      const longitude = graffiti.point.coordinates[0];
      const latitude = graffiti.point.coordinates[1];

      const latlng = `${latitude},${longitude}`;

      const response = await apiGeolocation.get('json', {
        params: {
          latlng,
          key: 'AIzaSyDFFAm6sy5xJlW-yGjE4RraqB5BFNjDHPg',
        },
      });

      setFormattedAdress(response.data.results[0].formatted_address);
    }
    setImageHeight(getWidthWindow);
    loadFormattedAdress();
    loadLike();
  }, [graffiti, images, imagesUrl, like]);

  function openImage(index) {
    setImageIndex(index);
    setIsOpen((currentIsOpen) => !currentIsOpen);
  }

  async function handleLike() {
    try {
      await api.post('like', {graffiti_id: graffiti.id});
      setLike(true);
    } catch (err) {
      Alert.alert('Erro: ' + err);
    }
  }

  async function handleDisLike() {
    try {
      await api.delete(`like/${graffiti.id}`);
      setLike(false);
    } catch (err) {
      Alert.alert('Erro: ' + err);
    }
  }

  function navigation() {
    Linking.openURL(
      `google.navigation:q=${graffiti.point.coordinates[1]},${graffiti.point.coordinates[0]}`,
    );
  }

  return (
    <Background>
      <Container>
        <SliderBox
          images={images}
          sliderBoxHeight={imageHeight}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          onCurrentImagePressed={(index) => openImage(index)}
          resizeMethod={'resize'}
        />
        <Modal visible={isOpen} transparent={true}>
          <ImageViewer
            imageUrls={imagesUrl}
            useNativeDriver={true}
            index={imageIndex}
            onSwipeDown={() => openImage(null)}
            enableSwipeDown={true}
          />
        </Modal>
        <ImageView images={graffiti.images} imageIndex={0} isVisible={false} />
        <GraffitiView>
          <GraffitiTitle>{graffiti.name}</GraffitiTitle>
        </GraffitiView>
        <GraffitiView>
          <Icon name="info" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.description}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Icon name="users" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.artist_name}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Icon name="calendar" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.dateFormated}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Icon name="map-pin" size={20} color="#c6c6c6" />
          <GraffitiDescription>{formattedAdress}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Icon name="play" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.distance}m</GraffitiDescription>
        </GraffitiView>
        <GraffitiActions>
          <ButtonAction
            onPress={like ? handleDisLike : handleLike}
            color={like ? 'red' : '#fff'}
            icon="heart">
            {like ? 'Gostei!' : 'Gostou?'}
          </ButtonAction>
          <ButtonAction color="#fff" icon="map-pin">
            Check-in
          </ButtonAction>
          <ButtonAction color="#fff" icon="navigation-2" onPress={navigation}>
            Bora lá?
          </ButtonAction>
          <ButtonAction color="#fff" icon="check-square">
            Salvar
          </ButtonAction>
        </GraffitiActions>
      </Container>
    </Background>
  );
}
