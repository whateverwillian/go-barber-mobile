import React from 'react';
import { Image } from 'react-native';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title } from './styles';
import logo from '../../assets/logo.png';

const SignIn: React.FC = () => (
  <Container>
    <Image source={logo} />

    <Title>Faça seu logon</Title>

    <Input icon="mail" name="email" placeholder="E-mail" />
    <Input icon="lock" name="password" placeholder="Password" />

    <Button
      onPress={() => {
        console.log('asdad');
      }}
    >
      Entrar
    </Button>
  </Container>
);

export default SignIn;
