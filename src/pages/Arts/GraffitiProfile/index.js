import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useSelector} from 'react-redux';

import {
  Modal,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import ImageViewer from 'react-native-image-zoom-viewer';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {SliderBox} from 'react-native-image-slider-box';

import api from '~/services/api';

import apiGeolocation from '~/services/apiGeolocation';

import {
  Container,
  GraffitiView,
  GraffitiTitle,
  GraffitiSub,
  GraffitiDescription,
  GraffitiActions,
  InputComment,
} from './styles';

import Background from '~/components/Background';
import ButtonAction from '~/components/ButtonAction';
import CommentModal from '~/components/CommentModal';

import {width} from '~/util/dimensions';

export default function GraffitiProfile({route}) {
  const profile = useSelector((state) => state.auth.user);

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
  const [loadComment, setLoadComment] = useState(false);
  const {navigate} = useNavigation();

  const getComments = useCallback(async () => {
    const response = await api.get(`comment/${graffiti.id}`);

    const data = response.data.map((commen) => ({
      ...commen,
      dateFormated: formatRelative(parseISO(commen.created_at), new Date(), {
        locale: pt,
        addSuffix: true,
      }),
    }));

    setComment(data);
  }, [graffiti.id]);

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
    getComments();
  }, [graffiti, images, imagesUrl, like, getComments]);

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
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    Linking.openURL(
      `${scheme}${graffiti.point.coordinates[1]},${graffiti.point.coordinates[0]}`,
    );
  }

  async function handleCreateComment() {
    setLoadComment(true);
    try {
      if (newComment.length !== 0) {
        await api.post('comment', {
          graffiti_id: graffiti.id,
          comment: newComment,
        });
        getComments();
        setNewComment('');
      } else {
        Alert.alert('Comentário vazio');
      }
      setLoadComment(false);
    } catch (err) {
      console.warn(err);
    }
  }

  async function handleRemove(id) {
    await api.delete(`graffitis/${id}`);
    navigate('Profile');
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
            enableImageZoom={false}
          />
        </Modal>
        <GraffitiView>
          <GraffitiSub>
            <GraffitiTitle>{graffiti.name}</GraffitiTitle>
            {profile.id === graffiti.user_id && (
              <ButtonAction
                color="#fff"
                icon="more-horizontal"
                onPress={() => {
                  Alert.alert(
                    'Ações',
                    '',
                    [
                      {
                        text: 'Editar',
                        onPress: () => console.log('Ask me later pressed'),
                      },
                      {
                        text: 'Remover',
                        onPress: () => handleRemove(graffiti.id),
                        style: 'destructive',
                      },
                      {text: 'Voltar'},
                    ],

                    {cancelable: false},
                  );
                }}
              />
            )}
          </GraffitiSub>
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
        <KeyboardAvoidingView behavior="position">
          <Modalize
            modalStyle={{backgroundColor: '#353544'}}
            modalHeight={350}
            ref={modalizeRef}
            FooterComponent={
              loadComment ? (
                <ActivityIndicator style={{height: 70}} />
              ) : (
                <InputComment
                  placeholder="Adicionar um comentário..."
                  returnKeyType="send"
                  value={newComment}
                  onChangeText={setNewComment}
                  onSubmitEditing={handleCreateComment}
                />
              )
            }>
            <CommentModal
              comments={comment}
              getComments={getComments}
              userId={graffiti.user_id}
            />
          </Modalize>
        </KeyboardAvoidingView>
      </Container>
    </Background>
  );
}
