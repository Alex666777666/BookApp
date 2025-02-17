import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';

export interface BookItem {
  id: string;
  title: string;
  cover_url?: string;
  author?: string;
  genre?: string;
  likes?: string;
  quotes?: string;
  summary?: string;
  views?: string;

  recommendedBooks?: Array<{id: string; title: string}>;
}

export interface HorisontalFlatListProps {
  data: BookItem[];
}

export const HorisontalFlatList: React.FC<HorisontalFlatListProps> = ({
  data,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Library'>>();
  const ITEM_WIDTH = 122;

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item, index) => item.id + '-' + index}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.bookItem}
          onPress={() => navigation.navigate('Detail', {book: item})}>
          {item.cover_url ? (
            <Image
              source={{uri: item.cover_url}}
              style={styles.bookCover}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bookCover} />
          )}
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  bookItem: {
    width: 110,
    marginRight: 12,
    marginBottom: 16,
  },
  bookCover: {
    width: '100%',
    aspectRatio: 2 / 2.6,
    backgroundColor: '#C4C4C4',
    borderRadius: 16,
    marginBottom: 4,
  },
  bookTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFFB2',
  },
});
