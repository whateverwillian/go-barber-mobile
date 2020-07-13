import React, { createContext, useCallback, useState, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useScrollToTop } from '@react-navigation/native';
import api from '../services/api.js';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthenticationContext {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(updateData: Partial<User>): void;
}

export const AuthContext = createContext<AuthenticationContext>(
  {} as AuthenticationContext,
);

export function useAuth(): AuthenticationContext {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider.');

  return context;
}

const AuthProvider: React.FC<{}> = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async (): Promise<void> => {
      const [response1, response2] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      // See async storage docs
      const token = response1[1];
      const user = response2[1];

      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user: JSON.parse(user) });
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [data],
  );

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const { user, token } = response.data;

    const formattedUser = {
      ...user,
      avatar: user.avatar_url,
    };

    api.defaults.headers.authorization = `Bearer ${token}`;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(formattedUser)],
    ]);

    setData({ user: formattedUser, token });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
