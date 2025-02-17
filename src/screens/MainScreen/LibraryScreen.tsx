import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HorisontalFlatList} from '../../components/Library/HorisontalFlatList';
import {SwiperList} from '../../components/Library/SwiperList';
import {fetchBooks} from '../../api/books/fetchBooks';
import {fetchSlides} from '../../api/slides/fetchSlides';

import {BooksContext} from '../../context/BooksProvider';

const SECTIONS_PER_PAGE = 5;

export const LibraryScreen = () => {
  const navigation = useNavigation();

  const {books, setBooks} = useContext(BooksContext);

  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allSectionsData, setAllSectionsData] = useState([]);
  const [currentSections, setCurrentSections] = useState([]);

  useEffect(() => {
    const fetchBooksAsync = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBooks();
        const mappedBooks = data.map(book => ({
          id: String(book.id),
          title: book.name,
          cover_url: book.cover_url,
          genre: book.genre,
          author: book.author,
          likes: book.likes,
          quotes: book.quotes,
          summary: book.summary,
          views: book.views,
        }));

        setBooks(mappedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooksAsync();
  }, [setBooks]);

  useEffect(() => {
    const fetchSlidesAsync = async () => {
      try {
        const slidesData = await fetchSlides();
        const mappedSlides = slidesData.map(slide => ({
          id: String(slide.id),
          title: `Slide ${slide.book_id}`,
          source: {uri: slide.cover},
        }));
        setSlides(mappedSlides);
      } catch (error) {
        console.error('Error fetching slides:', error);
      }
    };

    fetchSlidesAsync();
  }, []);

  useEffect(() => {
    const groupedBooks = books.reduce((acc, book) => {
      const {genre} = book;
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(book);
      return acc;
    }, {});

    const newSectionsData = Object.entries(groupedBooks).map(
      ([genre, books]) => ({
        title: genre,
        data: [books],
      }),
    );

    setAllSectionsData(newSectionsData);

    setCurrentSections(newSectionsData.slice(0, SECTIONS_PER_PAGE));
  }, [books]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    if (currentSections.length >= allSectionsData.length) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const nextCount = Math.min(
        currentSections.length + SECTIONS_PER_PAGE,
        allSectionsData.length,
      );
      setCurrentSections(allSectionsData.slice(0, nextCount));
      setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0f0f0f'}}>
      <View style={styles.container}>
        <View style={{marginBottom: 16}}>
          <Text style={styles.headerText}>Library</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#D0006E" />
        ) : (
          <SectionList
            sections={currentSections}
            keyExtractor={(item, index) => String(index)}
            stickySectionHeadersEnabled={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <SwiperList navigation={navigation} slidesData={slides} />
            }
            renderSectionHeader={({section}) => (
              <View style={{marginVertical: 8}}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            )}
            renderItem={({item}) => <HorisontalFlatList data={item} />}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={{paddingVertical: 20}}>
                  <ActivityIndicator size="large" color="#D0006E" />
                </View>
              ) : null
            }
            contentContainerStyle={{paddingBottom: 20}}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  headerText: {
    color: '#D0006E',
    fontFamily: 'Nunito Sans',
    fontSize: 20,
  },
  sectionTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
