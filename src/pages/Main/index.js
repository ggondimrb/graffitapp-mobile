import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, View, Text, StyleSheet, Alert} from 'react-native';

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

export default function Main({navigation}) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    // enquanto nao carregar a localizacao, nao mostrar o mapa
    return null;
  }

  function handlePickLocalization(e) {
    const {latitude, longitude} = e.nativeEvent.coordinate;

    setMarker({latitude, longitude});

    console.tron.log(marker);
  }

  async function loadArts() {
    setLoading(true);

    const {latitude, longitude} = currentRegion;

    const response = await api.get('/graffitis', {
      params: {
        latitude,
        longitude,
      },
    });

    setArts(response.data);
    setLoading(false);
    console.tron.log(arts);
  }

  return (
    <Container>
      <MapMain
        initialRegion={currentRegion}
        onRegionChangeComplete={handleRegionChanged}
        showsUserLocation={true}
        onPress={handlePickLocalization}>
        {arts.map((graffiti) => (
          <Marker
            key={graffiti.id}
            image={mapmarker}
            coordinate={{
              longitude: graffiti.point.coordinates[0],
              latitude: graffiti.point.coordinates[1],
            }}>
            <Callout
              onPress={() => {
                navigation.navigate('GraffitiProfile', {graffiti});
              }}>
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
      <ButtonSearch loading={loading} onPress={loadArts}>
        Buscar Graffitis
      </ButtonSearch>
    </Container>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF',
  },

  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  devBio: {
    color: '#666',
    marginTop: 5,
  },

  devTechs: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    height: 50,
    width: 50,
    backgroundColor: '#8E4Dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});
