import React, {useRef, useState} from 'react';
import {Image} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';

import ErrorMessage from '~/components/ErrorMessage';
import Background from '~/components/Background';
import {signInRequest} from '~/store/ducks/auth';

import icon from '~/assets/icon.png';

import {Feather} from '@expo/vector-icons';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Insira um e-mail válido')
    .required('Informe o e-mail'),
  password: Yup.string().label('Senha').required('Informe a senha'),
});
// navigation: propriedade existente nas telas
export default function SignIn({navigation}) {
  const dispatch = useDispatch();
  const passwordRef = useRef();

  const loading = useSelector((state) => state.auth.loading);

  async function handleOnLogin(values, actions) {
    const {email, password} = values;
    dispatch(signInRequest(email, password));
  }

  return (
    <Background>
      <Container>
        <Image style={{width: '100%'}} resizeMode="contain" source={icon} />
        <Formik
          initialValues={{email: '', password: ''}}
          onSubmit={(values, actions) => {
            handleOnLogin(values, actions);
          }}
          validationSchema={validationSchema}>
          {({
            handleChange,
            values,
            handleSubmit,
            errors,
            isValid,
            touched,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <FormInput
                icon="user"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="Digite seu e-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />

              <ErrorMessage errorValue={touched.email && errors.email} />

              <FormInput
                icon="key"
                secureTextEntry
                placeholder="Sua senha secreta"
                ref={passwordRef}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <ErrorMessage errorValue={touched.password && errors.password} />

              <SubmitButton
                disabled={!isValid || isSubmitting}
                loading={loading}
                onPress={handleSubmit}>
                Acessar
              </SubmitButton>
            </Form>
          )}
        </Formik>
        <SignLink
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <SignLinkText> Criar uma conta gratuita</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}
