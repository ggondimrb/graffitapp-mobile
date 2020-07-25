import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import {Marker, Callout} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import {
  Container,
  MapMain,
  ButtonSearch,
  CalloutView,
  CalloutTextTittle,
  CalloutTextDesc,
  CalloutImage,
  CalloutListImage,
} from './styles';
import mapmarker from '~/assets/map-marker.png';

import Background from '~/components/Background';
import Loader from '~/components/Loader';

import socket, {
  connect,
  disconnect,
  subscribeToNewGraffitis,
} from '~/services/socket';

export default function Main({navigation}) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [graffitis, setGraffitis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadInitial, setLoadInitial] = useState(false);

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

  useEffect(() => {
    subscribeToNewGraffitis((graf) => setGraffitis([...graffitis, graf]));
  }, [graffitis]);

  function setupWebSocket() {
    disconnect();

    const {latitude, longitude} = currentRegion;

    connect(latitude, longitude);
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    // enquanto nao carregar a localizacao, nao mostrar o mapa
    return (
      <Background>
        <Loader />
      </Background>
    );
  } else if (!loadInitial) {
    loadGraffitis();
    setLoadInitial(true);
  }

  function handlePickLocalization(e) {
    const {latitude, longitude} = e.nativeEvent.coordinate;

    setMarker({latitude, longitude});

    console.tron.log(marker);
  }

  function handleNavigationProfile(graffiti) {
    const images = [];

    graffiti.images.forEach((image) => {
      images.push(image.url);
    });

    navigation.navigate('GraffitiProfile', {graffiti, images});
  }

  async function loadGraffitis() {
    setLoading(true);

    const {latitude, longitude} = currentRegion;

    const response = await api.get('/graffitis', {
      params: {
        latitude,
        longitude,
      },
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
    console.tron.log(graffitis);
  }

  return (
    <Container>
      <MapMain
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChanged}
        showsUserLocation={true}
        onPress={handlePickLocalization}>
        {graffitis.map((graffiti) => (
          <Marker
            key={graffiti.id}
            image={mapmarker}
            coordinate={{
              longitude: graffiti.point.coordinates[0],
              latitude: graffiti.point.coordinates[1],
            }}>
            <Callout onPress={() => handleNavigationProfile(graffiti)}>
              <CalloutView>
                <CalloutListImage
                  horizontal={true}
                  data={graffiti.images}
                  keyExtractor={(item) => String(item.name)}
                  renderItem={({item}) => (
                    <CalloutImage
                      source={{
                        uri: item.url,
                      }}
                      resizeMode="cover"
                    />
                  )}
                />

                <CalloutTextTittle>{graffiti.name}</CalloutTextTittle>
                <CalloutTextDesc>{graffiti.description}</CalloutTextDesc>
                <CalloutTextDesc>{graffiti.artist_name}</CalloutTextDesc>
              </CalloutView>
            </Callout>
          </Marker>
        ))}
      </MapMain>
      <ButtonSearch loading={loading} onPress={loadGraffitis}>
        <Icon name="search" size={20} color="#fff" />
      </ButtonSearch>
    </Container>
  );
}
