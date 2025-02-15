import React, {useState, useEffect} from 'react';
import {View, Text, Platform, StatusBar} from 'react-native';
import {SplashScreen as CustomSplashScreen} from './src/screens/SplashScreen/SplashScreen';
import SplashScreen from 'react-native-splash-screen';

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
    <>
      <StatusBar barStyle="light-content" backgroundColor={'black'} />
      {isLoading ? (
        <CustomSplashScreen timer={timer} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <Text style={{fontSize: 24, color: 'black'}}>Your App Goes Here</Text>
        </View>
      )}
    </>
  );
};

export default App;
