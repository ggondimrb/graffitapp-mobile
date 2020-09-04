import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {
  Container,
  EditButton,
  ArtList,
  GraffitiImage,
  GraffitiContainer,
  Username,
} from './styles';
import Background from '~/components/Background';

import {useNavigation, useIsFocused} from '@react-navigation/native';
import api from '~/services/api';
import {formatRelative, parseISO} from 'date-fns';
import {pt} from 'date-fns/locale';

export interface Payload {
  auth: Auth;
}

export interface Auth {
  user: User;
}

export interface User {
  name: string;
  email: string;
  artist: boolean;
}

export interface Graffiti {
  id: number;
  name: string;
  description: string;
  artist_name: string;
  created_at: string;
  dateFormated: string;
  user_id: number;
  images: [
    {
      url: string;
      name: string;
      path: string;
    },
  ];
}

const Profile: React.FC = () => {
  const profile = useSelector((state: Payload) => state.auth.user);
  const {navigate} = useNavigation();
  const [graffitis, setGraffitis] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadGraffitis() {
      try {
        setLoading(true);

        const response = await api.get('graffitisByUser');

        const data = response.data.map((graf: Graffiti) => ({
          ...graf,
          dateFormated: formatRelative(parseISO(graf.created_at), new Date(), {
            locale: pt,
          }),
        }));

        setGraffitis(data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.warn(err);
      }
    }

    loadGraffitis();
  }, [isFocused]);

  function handleNavigationProfile(graffiti: Graffiti) {
    const images: Array<String> = [];

    graffiti.images.forEach((image) => {
      images.push(image.url);
    });

    navigate('GraffitiProfile', {graffiti, images});
  }

  return (
    <Background>
      <Container>
        <Username>Olá {profile.name}</Username>
        <EditButton
          onPress={() => {
            navigate('EditProfile');
          }}>
          Editar Perfil
        </EditButton>
        <ArtList
          data={graffitis}
          keyExtractor={(graf: Graffiti) => String(graf.id)}
          renderItem={({item}: {item: Graffiti}) => (
            <GraffitiContainer
              activeOpacity={0.9}
              onPress={() => handleNavigationProfile(item)}>
              <GraffitiImage source={{uri: item.images[0].url}} />
            </GraffitiContainer>
          )}
        />
      </Container>
    </Background>
  );
};

export default Profile;
