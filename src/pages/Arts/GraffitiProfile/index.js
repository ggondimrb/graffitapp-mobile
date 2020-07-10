import React from 'react';

import ImageView from 'react-native-image-view';

import {View} from 'react-native';

import {
  Container,
  Graffiti,
  GraffitiView,
  GraffitiImage,
  GraffitiTitle,
} from './styles';

import Background from '~/components/Background';

export default function GraffitiProfile({route}) {
  const {graffiti} = route.params;

  console.tron.log(graffiti);

  return (
    <Background>
      <Container>
        <GraffitiImage
          source={{
            uri: graffiti.images[0].url,
          }}
        />
        <GraffitiView>
          <GraffitiTitle>{graffiti.description}</GraffitiTitle>
        </GraffitiView>
        <ImageView images={graffiti.images} imageIndex={0} isVisible={false} />
      </Container>
    </Background>
  );
}
