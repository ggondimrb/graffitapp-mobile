import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';

import {
  Container,
  EditButton,
  ArtList,
  GraffitiImage,
  Username,
} from './styles';
import Background from '~/components/Background';

import {useNavigation} from '@react-navigation/native';
import api from '~/services/api';

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

  useEffect(() => {
    async function loadGraffitis() {
      try {
        setLoading(true);

        const response = await api.get('graffitisByUser');

        setGraffitis(response.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.warn(err);
      }
    }

    loadGraffitis();
  }, []);

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
            <GraffitiImage source={{uri: item.images[0].url}} />
          )}
        />
      </Container>
    </Background>
  );
};

export default Profile;
