import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/authContext';

import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  UserAvatar,
} from './styles';

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as RouteParams;

  const { user } = useAuth();

  const { navigate } = useNavigation();

  const navigateBack = React.useCallback(() => {
    navigate('Dashboard');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar }} />
      </Header>
    </Container>
  );
};

export default CreateAppointment;
