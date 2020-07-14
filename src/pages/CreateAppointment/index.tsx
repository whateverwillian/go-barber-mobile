import React from 'react';
import { Platform } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/authContext';
import api from '../../services/api.js';

import {
  Container,
  Header,
  HeaderTitle,
  BackButton,
  UserAvatar,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenCalendarButton,
  OpenCalendarButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
} from './styles';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
}

interface DayAvailability {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const { providerId } = route.params as RouteParams;

  const { user } = useAuth();
  const { navigate } = useNavigation();

  // STATES

  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState(providerId);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedHour, setSelectedHour] = React.useState(0);
  const [dayAvailability, setDayAvailability] = React.useState<
    DayAvailability[]
  >([]);

  // CALLBACKS

  const handleSelectProvider = React.useCallback((provider) => {
    setSelectedProvider(provider);
  }, []);

  const navigateBack = React.useCallback(() => {
    navigate('Dashboard');
  }, [navigate]);

  const handleToggleCalendar = React.useCallback(() => {
    setShowCalendar((state) => !state);
  }, []);

  const handleCalendarChange = React.useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowCalendar(false);
      }

      if (date) setSelectedDate(date);
    },
    [],
  );

  const handleSelectHour = React.useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  // MEMOS

  const morningAvailability = React.useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  const afternoonAvailability = React.useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  // EFFECTS

  React.useEffect(() => {
    api.get('providers').then(({ data }) => setProviders(data));
  }, []);

  React.useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1, // js boy...
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => setDayAvailability(data));
  }, [selectedDate, selectedProvider]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar }} />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenCalendarButton onPress={handleToggleCalendar}>
          <OpenCalendarButtonText>Selecionar data</OpenCalendarButtonText>
        </OpenCalendarButton>

        {showCalendar && (
          <DateTimePicker
            mode="date"
            display="calendar"
            value={selectedDate}
            textColor="#f4ede8"
            onChange={handleCalendarChange}
          />
        )}
      </Calendar>

      <Content>
        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  selected={selectedHour === hour}
                  onPress={() => (available ? handleSelectHour(hour) : null)}
                  key={formattedHour}
                  available={available}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    selected={selectedHour === hour}
                    onPress={() => (available ? handleSelectHour(hour) : null)}
                    key={formattedHour}
                    available={available}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
