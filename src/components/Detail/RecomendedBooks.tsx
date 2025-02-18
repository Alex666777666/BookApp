import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import {BookItem} from '../../types/bookItem';
import {SlideItem} from '../../types/slideItem';

interface RecommendedBooksProps {
  likeSectionBooks: BookItem[];
  slide?: SlideItem | null;
  handleSelectBook: (bookId: string) => void;
}

export const RecommendedBooks = ({
  likeSectionBooks,
  slide,
  handleSelectBook,
}: RecommendedBooksProps) => {
  if (likeSectionBooks.length === 0) return null;

  return (
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
        contentContainerStyle={styles.alsoLikeListContent}
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
  );
};

const styles = StyleSheet.create({
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
  sectionHeading: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    fontWeight: '700',
    color: '#0B080F',
    marginBottom: 12,
  },
});
