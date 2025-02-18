import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BooksContext} from '../../context/BooksProvider';

const ITEM_WIDTH = 160;
const ITEM_SPACING = 12;

export const BookSection = ({
  book,
  initialSameGenreBooks,
  handleSelectBook,
  animationStyle,
}) => {
  const [currentBook, setCurrentBook] = useState<BookItem | undefined>(book);
  const [genreBooks, setGenreBooks] = useState<BookItem[]>(
    initialSameGenreBooks,
  );

  const [activeIndex, setActiveIndex] = useState(
    book && initialSameGenreBooks
      ? initialSameGenreBooks.findIndex(b => b.id === book.id)
      : 0,
  );
  const {width} = Dimensions.get('window');

  const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_SPACING;

  const {books} = useContext(BooksContext);

  useEffect(() => {
    if (book) {
      setCurrentBook(book);
      const newGenreBooks = books.filter(b => b.genre === book.genre);
      setGenreBooks(newGenreBooks);
    }
  }, [book, books]);

  useEffect(() => {
    if (currentBook && genreBooks.length && activeIndex >= 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          x: activeIndex * FULL_ITEM_SIZE,
          animated: false,
        });
      }, 0);
    }
  }, [currentBook, genreBooks, activeIndex]);

  const scrollX = useSharedValue(0);

  const scrollRef = useRef<Animated.ScrollView>(null);

  useEffect(() => {
    setCurrentBook(book);
    setActiveIndex(initialSameGenreBooks.findIndex(b => b.id === book.id));
  }, [book, initialSameGenreBooks]);

  const handleMomentumEnd = useCallback(
    (newIndex: number) => {
      if (newIndex !== activeIndex && genreBooks[newIndex]) {
        handleSelectBook(genreBooks[newIndex].id, true);
      }
    },
    [activeIndex, genreBooks, handleSelectBook],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: event => {
      'worklet';
      const offsetX = event.contentOffset.x;
      const newIndex = Math.round(offsetX / FULL_ITEM_SIZE);
      runOnJS(handleMomentumEnd)(newIndex);
    },
  });

  return (
    <>
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
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        {genreBooks.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * FULL_ITEM_SIZE,
              index * FULL_ITEM_SIZE,
              (index + 1) * FULL_ITEM_SIZE,
            ];
            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1, 0.8],
              'clamp',
            );
            return {transform: [{scale}]};
          });
          return (
            <Animated.View key={item.id} style={[styles.coverContainer]}>
              {item.cover_url ? (
                <Animated.Image
                  source={{uri: item.cover_url}}
                  style={[styles.coverPlaceholder, animatedStyle]}
                  resizeMode="cover"
                />
              ) : (
                <Animated.View
                  style={[styles.coverPlaceholder, animatedStyle]}
                />
              )}
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <Animated.View style={[styles.textContainer, animationStyle]}>
        <Text style={styles.bookTitle}>{currentBook?.title}</Text>
        <Text style={styles.bookAuthor}>{currentBook?.author}</Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  bookAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFFCC',
    textAlign: 'center',
    marginBottom: 18,
  },
});
