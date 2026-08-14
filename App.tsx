import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/redux/store';
import { queryClient } from './src/services/queryClient';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { Colors } from './src/constants';
import Alert from './src/components/common/Alert';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <StatusBar
                backgroundColor={Colors.BACKGROUND}
                barStyle={'dark-content'}
              />
              <AppNavigator />
            </NavigationContainer>
          </QueryClientProvider>
          <Alert ref={ref => Alert.setRef(ref)} />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
