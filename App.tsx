import React, {useState, useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SplashScreen as CustomSplashScreen} from './src/screens/SplashScreen/SplashScreen';
import {LibraryScreen} from './src/screens/MainScreen/LibraryScreen';
import {DetailScreenScreen} from './src/screens/DetailScreen/DetailScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootStackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const timer = 2000;

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 300);
    }
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, timer);
    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar hidden={true} />
        <CustomSplashScreen timer={timer} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Library">
            <Stack.Screen
              name="Library"
              component={LibraryScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Detail"
              component={DetailScreenScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
