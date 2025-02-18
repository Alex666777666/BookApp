import React, {useEffect, useRef, useState} from 'react';
import {Platform, StatusBar, Animated, StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {SplashScreen as CustomSplashScreen} from './src/screens/SplashScreen/SplashScreen';
import {LibraryScreen} from './src/screens/MainScreen/LibraryScreen';
import {DetailScreen} from './src/screens/DetailScreen/DetailScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootStackParamList} from './src/types/navigation';

import {BooksProvider} from './src/context/BooksProvider';
import FastImage from 'react-native-fast-image';

const Stack = createNativeStackNavigator<RootStackParamList>();
const timer = 2000;

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        SplashScreen.hide();
      }, 300);
    }

    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();

    const timeoutId = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsAppReady(true);
      });
    }, timer);

    return () => clearTimeout(timeoutId);
  }, [splashOpacity]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <BooksProvider>
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
                component={DetailScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </BooksProvider>

      <Animated.View
        pointerEvents={isAppReady ? 'none' : 'auto'}
        style={[styles.splashContainer, {opacity: splashOpacity}]}>
        <CustomSplashScreen timer={timer} />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
});

export default App;
