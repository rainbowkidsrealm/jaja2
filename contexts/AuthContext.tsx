'use client';

import { loginApi } from '@/lib/api';
import { Admin, AuthState, Parent, Teacher, User } from '@/types';
import React, { createContext, useContext, useEffect, useReducer } from 'react';


interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; profile: Admin | Teacher | Parent } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: { user: User; profile: Admin | Teacher | Parent } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload.user,
        profile: action.payload.profile,
        isAuthenticated: true,
        loading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
};

// Mock profile data - replace with actual API calls
const getMockProfile = (user: User): Admin | Teacher | Parent => {
  switch (user.role) {
    case 'admin':
      return {
        id: 1,
        userId: user.id,
        name: 'John Admin',
        phone: '+1234567890',
        address: '123 Admin Street',
      };
    case 'teacher':
      return {
        id: 1,
        userId: user.id,
        teacher_id: 'T001',
        name: 'Jane Teacher',
        phone: '+1234567891',
        qualification: 'M.Ed',
        experience_years: 5,
        // isActive: true,
      };
    case 'parent':
      return {
        id: 1,
        userId: user.id,
        name: 'Bob Parent',
        phone: '+1234567892',
        occupation: 'Engineer',
      };
    default:
      throw new Error('Invalid user role');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      const user: User = JSON.parse(storedUser);
      const profile = getMockProfile(user);
      dispatch({ type: 'LOAD_USER', payload: { user, profile } });
    }
  }, []);

  // const login = async (email: string, password: string) => {
  //   dispatch({ type: 'LOGIN_START' });
  //   try {
  //     const { user, token } = await mockAuth.login(email, password);
  //     const profile = getMockProfile(user);

  //     mockAuth.setAuth(user, token);
  //     dispatch({ type: 'LOGIN_SUCCESS', payload: { user, profile } });
  //   } catch (error) {
  //     dispatch({ type: 'LOGIN_FAILURE' });
  //     throw error;
  //   }
  // };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await loginApi(email, password); // real API call
      const { token, refreshToken, user } = data;
      console.log('Auth user:', user);

      // Save in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      const profile = getMockProfile(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, profile } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };


  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};