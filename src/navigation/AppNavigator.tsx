import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/auth/authSlice';
import { AuthService } from '../services/auth/AuthService';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import ExpensesScreen from '../screens/Expenses/ExpensesScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import AddExpenseScreen from '../screens/AddExpense/AddExpenseScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import {
  AuthStackParamList,
  AppStackParamList,
  MainTabParamList,
} from './navigationTypes';
import Splash from '../components/common/Splash';
import { Blocks, BookOpenText, Gauge } from 'lucide-react-native';
import { Colors } from '../constants';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarButton: props => (
          // @ts-ignore
          <TouchableOpacity {...props} activeOpacity={0.6} />
        ),
      }}
    >
      <Tabs.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Gauge size={size} height={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Blocks size={size} height={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookOpenText size={size} height={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        animation: 'none',
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        animation: 'none',
        headerShown: false,
      }}
    >
      <AppStack.Screen name="MainTabs" component={MainTabs} />
      <AppStack.Screen name="AddExpense" component={AddExpenseScreen} />
      <AppStack.Screen name="Profile" component={ProfileScreen} />
    </AppStack.Navigator>
  );
}

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector(state => state.auth);

  useEffect(() => {
    return AuthService.onAuthStateChanged(nextUser => {
      dispatch(setUser(nextUser));
    });
  }, [dispatch]);

  if (!initialized) {
    return <Splash />;
  }

  return user ? <AppStackNavigator /> : <AuthNavigator />;
}
