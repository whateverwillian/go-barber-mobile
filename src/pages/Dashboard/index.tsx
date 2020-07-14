import React from 'react';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/authContext';
import api from '../../services/api.js';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  ProviderInfo,
  ProviderMeta,
  ProviderMetaText,
  ProvidersListTitle,
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatar: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [providers, setProviders] = React.useState<Provider[]>([]);

  const navigateToProfile = React.useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const navigateToCreateAppointment = React.useCallback(
    (providerId: string) => {
      navigate('CreateAppointment', { providerId });
    },
    [navigate],
  );

  React.useEffect(() => {
    api.get('providers').then(({ data }) => setProviders(data));
  }, []);

  return (
    <Container>
      <StatusBar backgroundColor="#28262e" />
      <Header>
        <HeaderTitle>
          Bem vindo,
          {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar }} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        keyExtractor={(provider) => provider.id}
        renderItem={({ item: provider }) => (
          <ProviderContainer
            onPress={() => navigateToCreateAppointment(provider.id)}
          >
            <ProviderAvatar source={{ uri: provider.avatar }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>8h ás 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
