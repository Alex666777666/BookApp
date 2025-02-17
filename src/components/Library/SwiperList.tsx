import React from 'react';
import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
import Swiper from 'react-native-swiper';

import FastImage from 'react-native-fast-image';

interface SwiperListProps {
  navigation: any;
  slidesData: Array<{
    id: string;
    title: string;
    source: any;
  }>;
}

export const SwiperList: React.FC<SwiperListProps> = ({
  navigation,
  slidesData,
}) => {
  const {width} = Dimensions.get('window');
  const smallDevice = width <= 375;

  return (
    <View>
      <View style={{height: smallDevice ? 160 : 200, marginBottom: 20}}>
        <Swiper
          loop
          dotColor="#c1c2ca"
          activeDotColor="#D0006E"
          paginationStyle={{bottom: 2}}
          containerStyle={styles.swiperWrapper}
          autoplay={true}
          autoplayTimeout={3}>
          {slidesData.map(item => (
            <Pressable
              key={item.id}
              onPress={() =>
                navigation.navigate('Detail', {
                  slide: item,
                })
              }>
              <FastImage
                source={item.source}
                style={styles.slideImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Pressable>
          ))}
        </Swiper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  swiperWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
});
