import React, {useEffect, useState, useRef} from 'react';
import {Modal, Alert, Linking} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import ImageViewer from 'react-native-image-zoom-viewer';
import ImageView from 'react-native-image-view';
import {Feather} from '@expo/vector-icons';

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
import Input from '~/components/Input';
import CommentModal from '~/components/CommentModal';

import {width, height} from '~/util/dimensions';

export default function GraffitiProfile({route}) {
  const {graffiti, images} = route.params;
  const [formattedAdress, setFormattedAdress] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState('');
  const [imagesUrl, setImagesUrl] = useState([]);
  const [imageHeight, setImageHeight] = useState('');
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState('');
  const modalizeRef = useRef(null);

  async function loadComment() {
    const response = await api.get(`comment/${graffiti.id}`);

    const data = response.data.map((commen) => ({
      ...commen,
      dateFormated: formatRelative(parseISO(commen.created_at), new Date(), {
        locale: pt,
        addSuffix: true,
      }),
    }));

    setComment(data);
  }

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
    setImageHeight(width);
    loadFormattedAdress();
    loadLike();
    loadComment();
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

  async function handleCreateComment() {
    try {
      const response = await api.post('comment', {
        graffiti_id: graffiti.id,
        comment: newComment,
      });
      setComment([]);
      loadComment();

      // const data = {
      //   id: response.data.id,
      //   comment: response.data.comment,
      //   created_at: response.data.createdAt,
      //   user: {
      //     id: response.data.user.id,
      //     name: response.data.user.name,
      //   },
      //   dateFormated: formatRelative(
      //     parseISO(response.data.createdAt),
      //     new Date(),
      //     {
      //       locale: pt,
      //       addSuffix: true,
      //     },
      //   ),
      // };

      // setComment((c) => [...c, data]);

      setNewComment('');
    } catch (err) {
      console.warn(err);
    }
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
          <Feather name="users" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.artist_name}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Feather name="calendar" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.dateFormated}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Feather name="map-pin" size={20} color="#c6c6c6" />
          <GraffitiDescription>{formattedAdress}</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Feather name="play" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.distance}m</GraffitiDescription>
        </GraffitiView>
        <GraffitiView>
          <Feather name="info" size={20} color="#c6c6c6" />
          <GraffitiDescription>{graffiti.description}</GraffitiDescription>
        </GraffitiView>
        <GraffitiActions>
          <ButtonAction
            onPress={like ? handleDisLike : handleLike}
            color={like ? 'red' : '#fff'}
            icon="heart"
          />
          <ButtonAction
            onPress={() => modalizeRef.current?.open()}
            color="#fff"
            icon="message-circle"
          />
          <ButtonAction onPress={navigation} color="#fff" icon="navigation-2" />
          <ButtonAction color="#fff" icon="save" />
        </GraffitiActions>
        <Modalize modalHeight={300} ref={modalizeRef}>
          <CommentModal comments={comment} />
          <Input
            style={{backgroundColor: '#353544'}}
            placeholder="Adicionar um comentário..."
            returnKeyType="send"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleCreateComment}
          />
        </Modalize>
      </Container>
    </Background>
  );
}
