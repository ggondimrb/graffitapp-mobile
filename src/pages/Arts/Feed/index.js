import React, {useEffect, useState} from 'react';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {withNavigationFocus} from 'react-navigation';

import api from '~/services/api';
import Geolocation from '@react-native-community/geolocation';

import Background from '~/components/Background';
import Button from '~/components/Button';

import {
  Container,
  GraffitiList,
  GraffitiView,
  Graffiti,
  Image,
  Title,
  Description,
  Artist,
  Localization,
  AddButton,
} from './styles';

function Feed({navigation, isFocused}) {
  const [graffitis, setGraffitis] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadGraffitis() {
    try {
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

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.tron.log(err);
    }
  }

  async function loadInitialPosition() {
    const granted = await PermissionsAndroid.request(
      await PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Localização',
        message: 'Grafitapp precisa acessar sua localização ',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await Geolocation.getCurrentPosition((position) => {
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

  useEffect(() => {
    if (isFocused) {
      loadInitialPosition();
      //if (!currentRegion) {
      loadGraffitis();
      //}
    }
  }, [isFocused]);

  if (!currentRegion) {
    // enquanto nao carregar a localizacao, nao mostrar o mapa
    return <Background />;
  }

  return (
    <Background>
      <Container>
        <Button loading={loading} onPress={loadGraffitis}>
          Buscar Graffitis
        </Button>
        <GraffitiList
          data={graffitis}
          keyExtractor={(graf) => String(graf.id)}
          renderItem={({item: graf}) => (
            <GraffitiView>
              <Image
                source={{
                  uri: graf.images[0].url,
                }}
              />
              <Graffiti>
                <Title>{graf.name}</Title>
                <Description>{graf.description}</Description>
                <Artist>{graf.artist}</Artist>
                <Localization>{graf.dateFormated}</Localization>
              </Graffiti>
            </GraffitiView>
          )}
        />

        <AddButton>
          <Icon
            name="plus"
            size={60}
            color="#fff"
            onPress={() => navigation.navigate('New')}
          />
        </AddButton>
      </Container>
    </Background>
  );
}

export default withNavigationFocus(Feed);
