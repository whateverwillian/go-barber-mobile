import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';

import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { useAuth } from '../../hooks/authContext';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api.js';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface UpdateFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirm: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();

  const formRef = React.useRef<FormHandles>(null);
  const emailInputRef = React.useRef<TextInput>(null);
  const oldPasswordInputRef = React.useRef<TextInput>(null);
  const passwordInputRef = React.useRef<TextInput>(null);
  const passwordConfirmInputRef = React.useRef<TextInput>(null);

  const { user, updateUser } = useAuth();

  const handleUpdate = React.useCallback(
    async (data: UpdateFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: (val) => !!val.length,
            then: Yup.string().required('Informe sua nova senha'),
            otherwise: Yup.string(),
          }),
          password_confirm: Yup.string()
            .when('old_password', {
              is: (val) => !!val.length,
              then: Yup.string().required('Confirme sua senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirm } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirm,
              }
            : {}),
        };

        const response = await api.put('/profile/update', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.navigate('Dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateAvatar = React.useCallback(() => {
    try {
      ImagePicker.showImagePicker(
        {
          title: 'Selecione um novo avatar',
          cancelButtonTitle: 'Cancelar',
          takePhotoButtonTitle: 'Usar câmera',
          chooseFromLibraryButtonTitle: 'Escolha um avatar da galeria',
        },
        (response) => {
          if (response.didCancel) {
            return console.log('did cancel');
          }

          if (response.error) {
            return console.log(response.error);
          }

          const data = new FormData();

          data.append('avatar', {
            type: 'image/jpg',
            name: `${user.id}.jpg`,
            uri: response.uri,
          });

          api
            .patch('users/avatar', data)
            .then(({ data: updatedUser }) => {
              console.log(updatedUser);
              updateUser(updatedUser);
            })
            .catch((err) => console.log(err));
        },
      );
    } catch (err) {
      console.log(err);
    }
  }, [updateUser, user.id]);

  const handleGoBack = React.useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleUpdate}>
              <Input
                autoCapitalize="words"
                icon="user"
                name="name"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                icon="mail"
                name="email"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />
              <Input
                containerStyle={{ marginTop: 10 }}
                ref={oldPasswordInputRef}
                secureTextEntry
                icon="lock"
                name="old_password"
                placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                icon="lock"
                name="password"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
              />
              <Input
                ref={passwordConfirmInputRef}
                secureTextEntry
                icon="lock"
                name="password_confirm"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}
            >
              Confirmar mudanças
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
