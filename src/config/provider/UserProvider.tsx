// src/context/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserSchema, TUserRole } from '@/schemas/IUserSchema';

interface UserContextType {
  isLoggedIn: boolean;
  user: IUserSchema | null;
  selectedRole: TUserRole;
  login: (user: any, role: any) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUserSchema | null>(null);
  const [selectedRole, setSelectedRole] = useState<TUserRole>('carpenter');
  useLayoutEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const role: any = await AsyncStorage.getItem('role');
      const userDataString = await AsyncStorage.getItem('user');

      if (token) setIsLoggedIn(true);
      if (role) setSelectedRole(role);
      if (userDataString) {
        const data: IUserSchema = JSON.parse(userDataString);
        setUser(data);
      }
    };
    loadToken();
  }, []);

  const login = async (user: IUserSchema, role: TUserRole) => {
    await AsyncStorage.setItem('token', 'dummy-token');
    await AsyncStorage.setItem('role', role);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setSelectedRole(role);
    setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('role');
    setIsLoggedIn(false);
  };

  const getUserRole = async () => {
    const role = await AsyncStorage.getItem('role');
    return role ? role : 'plumber';
  };

  const getUser = async () => {
    const userDataString = await AsyncStorage.getItem('user');
    return userDataString ?? null;
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, login, user, selectedRole, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useAuth must be used within UserProvider');
  return context;
};
