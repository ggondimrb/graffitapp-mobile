import React, {useRef, useState} from 'react';
import {Image, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Background from '~/components/Background';
import {signUpRequest} from '~/store/ducks/auth';

import api from '~/services/api';

import icon from '~/assets/icon.png';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';
// navigation: propriedade existente nas telas
export default function SignUp({navigation}) {
  const dispatch = useDispatch();
  const passwordRef = useRef();
  const emailRef = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector((state) => state.auth.loading);

  async function handleSubmit() {
    try {
      const response = api.post('users', {name, email, password});
      Alert.alert(response.data);
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('Erro ao criar usuário: ' + e);
    }
  }

  return (
    <Background>
      <Container>
        <Image style={{width: '100%'}} resizeMode="contain" source={icon} />
        <Form>
          <FormInput
            icon="user"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />
          <FormInput
            icon="mail"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            icon="key"
            secureTextEntry
            placeholder="Sua senha secreta"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Criar Conta
          </SubmitButton>
        </Form>

        <SignLink
          onPress={() => {
            navigation.navigate('SignIn');
          }}>
          <SignLinkText> Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}
