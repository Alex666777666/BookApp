import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import frame from '../../assets/pictures/Frame.png';
import {LeftArrow} from '../../ui/LeftArrow';

const {width} = Dimensions.get('window');

const ITEM_WIDTH = 160;
const ITEM_SPACING = 12;

const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

export const DetailScreenScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const bookData = {
    title: 'If It’s Only Love',
    author: 'Zoey Evers',
    covers: [
      {id: 'c1', label: 'Cover 1'},
      {id: 'c2', label: 'Cover 2'},
      {id: 'c3', label: 'Cover 3'},
      {id: 'c4', label: 'Cover 4'},
      {id: 'c5', label: 'Cover 5'},
      {id: 'c6', label: 'Cover 6'},
      {id: 'c7', label: 'Cover 7'},
      {id: 'c8', label: 'Cover 8'},
      {id: 'c9', label: 'Cover 9'},
      {id: 'c10', label: 'Cover 10'},
    ],
    stats: [
      {label: 'Readers', value: '22.2k'},
      {label: 'Likes', value: '10.4k'},
      {label: 'Quotes', value: '32.5k'},
      {label: 'Genre', value: 'Hot 🌶️'},
    ],
    summary: `According to researchers at Duke University, habits account for about 40 percent of our behaviors on any given day. Your life today is essentially the sum of your habits. How in shape or out of shape you are? A result of your habits. How happy or unhappy you are? A result of your habits. How successful or unsuccessful you are? A result of your habits.`,
    recommendedBooks: [
      {id: 'b1', title: 'The Christmas Surprise'},
      {id: 'b2', title: 'Holding You'},
      {id: 'b3', title: 'Petal Plucker'},
    ],
  };

  return (
    <ImageBackground source={frame} style={styles.bgImage}>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>

        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={FULL_ITEM_SIZE}
          snapToAlignment="start"
          contentContainerStyle={{
            paddingHorizontal: (width - ITEM_WIDTH) / 2,
            paddingTop: 15,
          }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}>
          {bookData.covers.map((cover, index) => {
            const inputRange = [
              (index - 1) * FULL_ITEM_SIZE,
              index * FULL_ITEM_SIZE,
              (index + 1) * FULL_ITEM_SIZE,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1, 0.8],
              extrapolate: 'clamp',
            });

            return (
              <View key={cover.id} style={[styles.coverContainer]}>
                <Animated.View
                  style={[styles.coverPlaceholder, {transform: [{scale}]}]}
                />
              </View>
            );
          })}
        </Animated.ScrollView>
        <View style={{paddingTop: 15}}>
          <Text style={styles.bookTitle}>{bookData.title}</Text>
          <Text style={styles.bookAuthor}>{bookData.author}</Text>
        </View>
      </SafeAreaView>

      <View style={styles.topWhiteCard} />
      <View style={styles.bottomWhiteCard}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsContainer}>
            {bookData.stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={{backgroundColor: '#C4C4C4', height: 1}} />
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionHeading}>Summary</Text>
            <Text style={styles.summaryText}>{bookData.summary}</Text>
          </View>
          <View
            style={{backgroundColor: '#C4C4C4', height: 1, marginBottom: 15}}
          />
          <Text style={styles.sectionHeading}>You will also like</Text>
          <FlatList
            data={bookData.recommendedBooks}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.alsoLikeListContent}
            renderItem={({item}) => (
              <View style={styles.recommendedItem}>
                <View style={styles.recommendedPlaceholder} />
                <View
                  style={{
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={styles.recommendedTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </View>
            )}
          />
          <View style={{alignContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.readNowButton}>
              <Text style={styles.readNowButtonText}>Read Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    marginLeft: 16,
    marginTop: 16,
  },
  topWhiteCard: {
    backgroundColor: '#ffffff',
    height: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomWhiteCard: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  coverContainer: {
    width: 160,
    marginRight: 12,
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: 160,
    height: 200,
    backgroundColor: '#C4C4C4',
    borderRadius: 16,
  },

  bookTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  bookAuthor: {
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFFCC',
    textAlign: 'center',
    marginBottom: 18,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontWeight: '700',
    color: '#0B080F',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '700',
    color: '#D9D5D6',
  },

  summaryContainer: {
    paddingTop: 16,
    marginBottom: 15,
  },
  sectionHeading: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    fontWeight: '700',
    color: '#0B080F',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    color: '#393637',
  },

  alsoLikeListContent: {
    paddingHorizontal: 16,
  },

  recommendedItem: {
    marginRight: 12,
    width: 120,
    alignItems: 'center',
  },

  recommendedPlaceholder: {
    width: 120,
    height: 150,
    backgroundColor: '#C4C4C4',
    borderRadius: 16,
  },

  recommendedTitle: {
    color: '#393637',
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 17,
  },

  readNowButton: {
    backgroundColor: '#DD48A1',
    borderRadius: 30,
    width: 278,
    height: 48,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readNowButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '800',
  },
});
