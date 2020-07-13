import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotText,
  CreateAccountButton,
  CreateAccountText,
} from './styles';
import logo from '../../assets/logo.png';

const SignIn: React.FC = () => (
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
          <Image source={logo} />

          <View>
            <Title>Faça seu logon</Title>
          </View>

          <Input icon="mail" name="email" placeholder="E-mail" />
          <Input icon="lock" name="password" placeholder="Password" />

          <Button
            onPress={() => {
              console.log('Entrar');
            }}
          >
            Entrar
          </Button>

          <ForgotPassword onPress={() => console.log('Esqueci minha senha ')}>
            <ForgotText>Esqueci minha senha</ForgotText>
          </ForgotPassword>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>

    <CreateAccountButton onPress={() => console.log('Criar uma conta')}>
      <Icon name="log-in" size={20} color="#ff9000" />
      <CreateAccountText>Criar uma conta</CreateAccountText>
    </CreateAccountButton>
  </>
);

export default SignIn;
