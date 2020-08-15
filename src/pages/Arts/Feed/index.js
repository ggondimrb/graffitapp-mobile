import React, {useEffect, useState} from 'react';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {Feather} from '@expo/vector-icons';
import {withNavigationFocus} from 'react-navigation';

import api from '~/services/api';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';

import Background from '~/components/Background';

import {width} from '~/util/dimensions';

import socket, {
  connect,
  disconnect,
  subscribeToNewGraffitis,
} from '~/services/socket';

import {
  Container,
  GraffitiList,
  GraffitiView,
  Graffiti,
  Image,
  Title,
  Description,
  AddButton,
} from './styles';

function Feed({navigation, isFocused}) {
  const [graffitis, setGraffitis] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageHeight, setImageHeight] = useState('');
  const [loadInitial, setLoadInitial] = useState(false);

  async function loadGraffitis() {
    try {
      setImageHeight(width());

      setLoading(true);
      console.tron.log(currentRegion);
      const {latitude, longitude} = currentRegion;

      const response = await api.get('graffitis', {
        params: {latitude, longitude},
      });

      const data = response.data.map((graf) => ({
        ...graf,
        dateFormated: formatRelative(parseISO(graf.created_at), new Date(), {
          locale: pt,
          addSuffix: true,
        }),
      }));

      setGraffitis(data);
      setupWebSocket();

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.tron.log(err);
    }
  }

  async function loadInitialPosition() {
    const {granted} = await requestPermissionsAsync();

    if (granted) {
      const {coords} = await getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      const {latitude, longitude} = coords;

      setCurrentRegion({
        latitude,
        longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadInitialPosition();
      //if (!currentRegion) {
      loadGraffitis();
      //}
    }

    subscribeToNewGraffitis((graf) => setGraffitis([...graffitis, graf]));
  }, [isFocused, graffitis]);

  function setupWebSocket() {
    disconnect();

    const {latitude, longitude} = currentRegion;

    connect(latitude, longitude);
  }

  function handleNavigationProfile(graffiti) {
    const images = [];

    graffiti.images.forEach((image) => {
      images.push(image.url);
    });

    navigation.navigate('GraffitiProfile', {graffiti, images});
  }

  if (!currentRegion) {
    // enquanto nao carregar a localizacao, nao mostrar o mapa
    return <Background />;
  } else if (!loadInitial) {
    loadGraffitis();
    setLoadInitial(true);
  }

  return (
    <Background>
      <Container>
        <GraffitiList
          refreshing={graffitis.networkStatus === 4}
          onRefresh={loadGraffitis}
          data={graffitis}
          keyExtractor={(graf) => String(graf.id)}
          renderItem={({item: graf}) => (
            <Graffiti
              activeOpacity={0.9}
              onPress={() => handleNavigationProfile(graf)}>
              <Image
                height={imageHeight}
                source={{
                  uri: graf.images.length
                    ? graf.images[0].url
                    : 'https://encurtador.com.br/hDKL6',
                }}
              />
              <Title>{graf.name}</Title>
              <GraffitiView>
                <Feather name="info" size={20} color="#c6c6c6" />
                <Description>{graf.description}</Description>
              </GraffitiView>
              <GraffitiView>
                <Feather name="users" size={20} color="#c6c6c6" />
                <Description>{graf.artist_name}</Description>
              </GraffitiView>
              <GraffitiView>
                <Feather name="calendar" size={20} color="#c6c6c6" />
                <Description>{graf.dateFormated}</Description>
              </GraffitiView>
            </Graffiti>
          )}
        />

        <AddButton onPress={() => navigation.navigate('New')}>
          <Feather name="plus" size={40} color="#fff" />
        </AddButton>
      </Container>
    </Background>
  );
}

export default withNavigationFocus(Feed);
