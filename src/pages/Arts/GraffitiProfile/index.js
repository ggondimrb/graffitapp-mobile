import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/Feather';

import {SliderBox} from 'react-native-image-slider-box';

import apiGeolocation from '~/services/apiGeolocation';

import {
  Container,
  GraffitiView,
  GraffitiTitle,
  GraffitiDescription,
} from './styles';

import Background from '~/components/Background';

import {getWidthWindow} from '~/util/dimensions';

export default function GraffitiProfile({route}) {
  const {graffiti, images} = route.params;
  const [formattedAdress, setFormattedAdress] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState('');
  const [imagesUrl, setImagesUrl] = useState([]);
  const [imageHeight, setImageHeight] = useState('');

  useEffect(() => {
    async function loadFormattedAdress() {
      setImageHeight(getWidthWindow);

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
    loadFormattedAdress();
  }, [graffiti, images, imagesUrl]);

  function openImage(index) {
    setImageIndex(index);
    setIsOpen((currentIsOpen) => !currentIsOpen);
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
        {/* <ImageView
          images={images}
          imageIndex={imageIndex}
          isVisible={isOpen}
          onClose={() => setIsOpen(false)}
        /> */}
        <Modal visible={isOpen} transparent={true}>
          <ImageViewer
            imageUrls={imagesUrl}
            useNativeDriver={true}
            index={imageIndex}
            onSwipeDown={() => openImage(null)}
            enableSwipeDown={true}
          />
        </Modal>

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

        <ImageView images={graffiti.images} imageIndex={0} isVisible={false} />
      </Container>
    </Background>
  );
}
