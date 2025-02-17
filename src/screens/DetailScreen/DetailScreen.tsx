import React, {useRef, useState, useEffect, useContext} from 'react';
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
  Image,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {LeftArrow} from '../../ui/LeftArrow';
import frame from '../../assets/pictures/Frame.png';
import {fetchLikeSection} from '../../api/likeSection/fetchLikeSection';
import {BooksContext} from '../../context/BooksProvider';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = 160;
const ITEM_SPACING = 12;
const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

export const DetailScreen = () => {
  const [likeSectionBooks, setLikeSectionBooks] = useState<BookItem[]>([]);

  const navigation = useNavigation();
  const route = useRoute();

  const {books} = useContext(BooksContext);

  const {book, sameGenreBooks, slide} = route.params as {
    book?: BookItem;
    sameGenreBooks?: BookItem[];
    slide?: SlideItem;
  };

  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const startIndex = sameGenreBooks.findIndex(b => b.id === book.id);
  const [activeIndex, setActiveIndex] = useState(
    startIndex >= 0 ? startIndex : 0,
  );

  useEffect(() => {
    if (startIndex > 0) {
      scrollRef.current?.scrollTo({
        x: startIndex * FULL_ITEM_SIZE,
        animated: false,
      });
    }
  }, [startIndex]);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const likedIDs = await fetchLikeSection();
        console.log('likedIDs =>', likedIDs);

        const matched = books.filter(book =>
          likedIDs.includes(Number(book.id)),
        );

        setLikeSectionBooks(matched);
      } catch (err) {
        console.error('Error fetching liked IDs:', err);
      }
    };

    if (books.length > 0) {
      fetchLiked();
    }
  }, [books]);

  const onMomentumScrollEnd = e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / FULL_ITEM_SIZE);

    if (newIndex !== activeIndex) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setActiveIndex(newIndex);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const currentBook = sameGenreBooks[activeIndex];

  const stats = [
    {label: 'Readers', value: currentBook.views},
    {label: 'Likes', value: currentBook.likes},
    {label: 'Quotes', value: currentBook.quotes},
    {label: 'Genre', value: currentBook.genre},
  ];

  return (
    <ImageBackground source={frame} style={styles.bgImage}>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>

        <Animated.ScrollView
          ref={scrollRef}
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
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}>
          {sameGenreBooks.map((item, index) => {
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
              <View key={item.id} style={styles.coverContainer}>
                {item.cover_url ? (
                  <Animated.Image
                    source={{uri: item.cover_url}}
                    style={[styles.coverPlaceholder, {transform: [{scale}]}]}
                    resizeMode="cover"
                  />
                ) : (
                  <Animated.View
                    style={[styles.coverPlaceholder, {transform: [{scale}]}]}
                  />
                )}
              </View>
            );
          })}
        </Animated.ScrollView>

        <Animated.View style={[styles.textContainer, {opacity: fadeAnim}]}>
          <Text style={styles.bookTitle}>{currentBook.title}</Text>
          <Text style={styles.bookAuthor}>{currentBook.author}</Text>
        </Animated.View>
      </SafeAreaView>

      <View style={styles.topWhiteCard} />
      <View style={styles.bottomWhiteCard}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{opacity: fadeAnim}}>
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
            <View style={{backgroundColor: '#C4C4C4', height: 1}} />
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionHeading}>Summary</Text>
              <Text style={styles.summaryText}>{currentBook.summary}</Text>
            </View>
            {likeSectionBooks.length > 0 && (
              <>
                <View
                  style={{
                    backgroundColor: '#C4C4C4',
                    height: 1,
                    marginBottom: 15,
                  }}
                />
                <Text style={styles.sectionHeading}>You will also like</Text>
                <FlatList
                  data={likeSectionBooks}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.alsoLikeListContent}
                  renderItem={({item}) => (
                    <View style={styles.recommendedItem}>
                      {item.cover_url ? (
                        <Image
                          source={{uri: item.cover_url}}
                          style={styles.recommendedPlaceholder}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.recommendedPlaceholder} />
                      )}
                      <View style={{alignSelf: 'flex-start'}}>
                        <Text style={styles.recommendedTitle} numberOfLines={2}>
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </>
            )}
          </Animated.View>

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
    width: ITEM_WIDTH,
    marginRight: ITEM_SPACING,
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: ITEM_WIDTH,
    height: 200,
    backgroundColor: '#C4C4C4',
    borderRadius: 16,
  },
  textContainer: {
    paddingTop: 15,
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
    marginTop: 10,
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
