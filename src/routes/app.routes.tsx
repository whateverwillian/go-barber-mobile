import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import CreateAppointment from '../pages/CreateAppointment';
import AppointmentCreated from '../pages/AppointmentCreated';

const { Navigator, Screen } = createStackNavigator();

const AppRoutes: React.FC = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
  >
    <Screen name="Dashboard" component={Dashboard} />
    <Screen name="CreateAppointment" component={CreateAppointment} />
    <Screen name="AppointmentCreated" component={AppointmentCreated} />

    <Screen name="Profile" component={Profile} />
  </Navigator>
);

export default AppRoutes;
