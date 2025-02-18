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
import BookDetails from '../../components/Detail/BookDetails';
import {RecommendedBooks} from '../../components/Detail/RecomendedBooks';

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
            {currentBook && <BookDetails book={currentBook} />}

            {likeSectionBooks.length > 0 && (
              <RecommendedBooks
                likeSectionBooks={likeSectionBooks}
                slide={slide}
                handleSelectBook={handleSelectBook}
              />
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
