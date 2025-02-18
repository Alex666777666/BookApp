import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {BooksContext} from '../../context/BooksProvider';
import {LeftArrow} from '../../ui/LeftArrow';
import frame from '../../assets/pictures/Frame.png';
import {fetchLikeSection} from '../../api/likeSection/fetchLikeSection';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import {BookSection} from '../../components/Detail/BookSection';

interface BookItem {
  id: string;
  title: string;
  cover_url?: string;
  genre?: string;
  author?: string;
  likes?: string;
  quotes?: string;
  summary?: string;
  views?: string;
}

interface SlideItem {
  id: string;
  title: string;
  source: {uri?: string};
}

const ITEM_WIDTH = 160;
const ITEM_SPACING = 12;
const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

export const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {books} = useContext(BooksContext);

  const {
    book,
    sameGenreBooks: initialSameGenreBooks = [],
    slide,
  } = route.params as {
    book?: BookItem;
    sameGenreBooks?: BookItem[];
    slide?: SlideItem;
  };

  const [currentBook, setCurrentBook] = useState<BookItem | undefined>(book);
  const [genreBooks, setGenreBooks] = useState<BookItem[]>(
    initialSameGenreBooks,
  );
  const [activeIndex, setActiveIndex] = useState(
    book && initialSameGenreBooks
      ? initialSameGenreBooks.findIndex(b => b.id === book.id)
      : 0,
  );

  const animatedOpacity = useSharedValue(1);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    };
  });

  const genreBooksMap = useMemo(() => {
    const map: {[key: string]: BookItem[]} = {};
    books.forEach(b => {
      if (b.genre) {
        if (!map[b.genre]) {
          map[b.genre] = [];
        }
        map[b.genre].push(b);
      }
    });
    return map;
  }, [books]);

  const [likeSectionBooks, setLikeSectionBooks] = useState<BookItem[]>([]);
  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const likedIDs = await fetchLikeSection();
        const matched = books.filter(b => likedIDs.includes(Number(b.id)));
        setLikeSectionBooks(matched);
      } catch (err) {
        console.error('Error fetching liked IDs:', err);
      }
    };
    if (books.length > 0) {
      fetchLiked();
    }
  }, [books]);

  const scrollRef = useRef<Animated.ScrollView>(null);

  const updateDataAfterFadeOut = useCallback(
    (selectedBookId: string, skipScroll?: boolean) => {
      const selectedBook = books.find(b => b.id === selectedBookId);
      if (!selectedBook) {
        animatedOpacity.value = withTiming(1, {duration: 200});
        return;
      }
      const newGenreBooks = selectedBook.genre
        ? genreBooksMap[selectedBook.genre] || []
        : [];
      const newActiveIndex = newGenreBooks.findIndex(
        b => b.id === selectedBookId,
      );
      setCurrentBook(selectedBook);
      setGenreBooks(newGenreBooks);
      setActiveIndex(newActiveIndex >= 0 ? newActiveIndex : 0);
      if (!skipScroll && newActiveIndex >= 0) {
        scrollRef.current?.scrollTo({
          x: newActiveIndex * FULL_ITEM_SIZE,
          animated: true,
        });
      }

      animatedOpacity.value = withTiming(1, {duration: 200});
    },
    [books, genreBooksMap, animatedOpacity],
  );

  const handleSelectBook = useCallback(
    (selectedBookId: string, skipScroll?: boolean) => {
      animatedOpacity.value = withTiming(0, {duration: 200}, () => {
        runOnJS(updateDataAfterFadeOut)(selectedBookId, skipScroll);
      });
    },
    [updateDataAfterFadeOut, animatedOpacity],
  );

  const stats = currentBook
    ? [
        {label: 'Readers', value: currentBook.views},
        {label: 'Likes', value: currentBook.likes},
        {label: 'Quotes', value: currentBook.quotes},
        {label: 'Genre', value: currentBook.genre},
      ]
    : [];

  return (
    <ImageBackground source={frame} style={styles.bgImage}>
      <SafeAreaView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>

        {currentBook && genreBooks.length ? (
          <BookSection
            book={currentBook}
            initialSameGenreBooks={genreBooks}
            handleSelectBook={handleSelectBook}
            animationStyle={animationStyle}
          />
        ) : slide ? (
          <View style={{alignItems: 'center', padding: 20}}>
            <FastImage
              source={slide.source}
              style={{width: '100%', height: 300, borderRadius: 16}}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ) : null}
      </SafeAreaView>

      <View style={styles.topWhiteCard} />
      <View style={styles.bottomWhiteCard}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{...animationStyle}}>
            {currentBook && (
              <>
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
              </>
            )}

            {likeSectionBooks.length > 0 && (
              <>
                <View
                  style={{
                    display: slide ? 'none' : 'flex',
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
                  contentContainerStyle={[
                    {paddingVertical: !book ? 60 : 0},
                    styles.alsoLikeListContent,
                  ]}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.recommendedItem}
                      onPress={() => handleSelectBook(item.id)}>
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
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </Animated.View>

          <View style={{alignItems: 'center'}}>
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
  bgImage: {flex: 1, resizeMode: 'cover'},
  backButton: {marginLeft: 16, marginTop: 16},
  topWhiteCard: {
    backgroundColor: '#ffffff',
    height: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomWhiteCard: {backgroundColor: '#ffffff', flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingBottom: 40},

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  statItem: {alignItems: 'center'},
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
  summaryContainer: {paddingTop: 16, marginBottom: 15},
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
  alsoLikeListContent: {paddingHorizontal: 16},
  recommendedItem: {marginRight: 12, width: 120, alignItems: 'center'},
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

export default DetailScreen;
