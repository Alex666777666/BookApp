import React, {useState, useEffect} from 'react';
import {View, Text, Platform, StatusBar, SafeAreaView} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {SplashScreen as CustomSplashScreen} from './src/screens/SplashScreen/SplashScreen';
import {LibraryScreen} from './src/screens/MainScreen/LibraryScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const timer = 2000;

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
  }, [timer]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {isLoading ? (
        <>
          <StatusBar hidden={true} />
          <CustomSplashScreen timer={timer} />
        </>
      ) : (
        <>
          <StatusBar barStyle="light-content" backgroundColor={'#000000'} />

          <LibraryScreen />
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default App;
