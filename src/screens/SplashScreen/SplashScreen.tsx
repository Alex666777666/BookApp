import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import * as Progress from 'react-native-progress';

import loading from '../../assets/pictures/loading.png';

type SplashScreenProps = {
  timer: number;
};

export const SplashScreen = ({timer}: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;

      const newProgress = Math.min(elapsedTime / timer, 1);

      if (isMounted) {
        setProgress(newProgress);
      }

      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timer]);

  return (
    <ImageBackground source={loading} style={styles.bgImage}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Book App</Text>
          <Text style={styles.subTitle}>Welcome to Book App</Text>
        </View>
        <Progress.Bar
          progress={progress}
          unfilledColor="#FFFFFF33"
          borderWidth={0}
          color="#ffffff"
          width={274}
          height={6}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
  },
  titleContainer: {
    gap: 12,
    alignItems: 'center',
  },
  mainTitle: {
    fontWeight: '700',
    fontSize: 52,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: '#DD48A1',
  },
  subTitle: {
    fontWeight: '700',
    fontSize: 24,
    fontFamily: 'Nunito Sans',
    color: '#FFFFFFCC',
  },
});
