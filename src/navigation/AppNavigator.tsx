import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

import {
  AuthStackParamList,
  AppStackParamList,
  MainTabParamList,
} from './navigationTypes';
import Splash from '../components/common/Splash';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="Dashboard" component={DashboardScreen} />
      <Tabs.Screen name="Expenses" component={ExpensesScreen} />
      <Tabs.Screen name="Reports" component={ReportsScreen} />
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
    <AppStack.Navigator>
      <AppStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Expense' }}
      />
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
