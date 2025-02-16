import React, {useState} from 'react';
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

export const LibraryScreen = () => {
  const navigation = useNavigation();

  const slidesData = [
    {
      id: '1',
      title: 'Heroine',
      source: require('../../assets/mockedPictures/picture1.png'),
    },
    {
      id: '2',
      title: 'Virgin',
      source: require('../../assets/mockedPictures/picture2.png'),
    },
  ];

  const sectionsData = [
    {
      title: 'New Arrivals',
      data: [
        [
          {id: '1', title: 'A Beta Before an Alpha', bookId: '001'},
          {id: '2', title: 'Alpha’s Bride', bookId: '002'},
          {id: '3', title: 'Howling Moon', bookId: '003'},
          {id: '4', title: "The Wolf's Den", bookId: '004'},
          {id: '5', title: "The Alpha's Mate", bookId: '005'},
          {id: '6', title: 'Moonlight Serenade', bookId: '006'},
          {id: '7', title: 'Furry Little Secret', bookId: '007'},
          {id: '8', title: 'The Howling Truth', bookId: '008'},
          {id: '9', title: 'Pawsitive Vibes Only', bookId: '009'},
          {id: '10', title: 'Fur-Ever Friends', bookId: '010'},
          {id: '11', title: 'Tail of Temptation', bookId: '011'},
          {id: '12', title: 'Whisker Woes', bookId: '012'},
        ],
      ],
    },
    {
      title: 'Romance',
      data: [
        [
          {id: '4', title: 'Forbidden Love'},
          {id: '5', title: 'Prince Reagan'},
          {id: '6', title: 'Hangry Wolf With His Queen'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'New Arrivals',
      data: [
        [
          {id: '1', title: 'Billionaire Wolf', bookId: '001'},
          {id: '2', title: 'Alpha’s Bride', bookId: '002'},
          {id: '3', title: 'Howling Moon', bookId: '003'},
          {id: '4', title: "The Wolf's Den", bookId: '004'},
          {id: '5', title: "The Alpha's Mate", bookId: '005'},
          {id: '6', title: 'Moonlight Serenade', bookId: '006'},
          {id: '7', title: 'Furry Little Secret', bookId: '007'},
          {id: '8', title: 'The Howling Truth', bookId: '008'},
          {id: '9', title: 'Pawsitive Vibes Only', bookId: '009'},
          {id: '10', title: 'Fur-Ever Friends', bookId: '010'},
          {id: '11', title: 'Tail of Temptation', bookId: '011'},
          {id: '12', title: 'Whisker Woes', bookId: '012'},
        ],
      ],
    },
    {
      title: 'Romance',
      data: [
        [
          {id: '4', title: 'Forbidden Love'},
          {id: '5', title: 'Prince Reagan'},
          {id: '6', title: 'Hangry Wolf With His Queen'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
    {
      title: 'Top Romantic Comedy',
      data: [
        [
          {id: '7', title: "Alpha's Abandoned..."},
          {id: '8', title: 'Year of Goodbyes'},
          {id: '9', title: 'Prince Reagan'},
        ],
      ],
    },
  ];

  const SECTIONS_PER_PAGE = 5;
  const [currentSections, setCurrentSections] = useState(
    sectionsData.slice(0, SECTIONS_PER_PAGE),
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = () => {
    if (loadingMore || currentSections.length >= sectionsData.length) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextCount = Math.min(
        currentSections.length + SECTIONS_PER_PAGE,
        sectionsData.length,
      );
      setCurrentSections(sectionsData.slice(0, nextCount));
      setLoadingMore(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0f0f0f'}}>
      <View style={styles.container}>
        <View style={{marginBottom: 16}}>
          <Text style={styles.headerText}>Library</Text>
        </View>
        <SectionList
          sections={currentSections}
          keyExtractor={(item, index) => String(index)}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <SwiperList navigation={navigation} slidesData={slidesData} />
          }
          renderSectionHeader={({section}) => (
            <View style={{marginVertical: 8}}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          renderItem={({item}) => <HorisontalFlatList data={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{paddingVertical: 20}}>
                <ActivityIndicator size="large" color="#D0006E" />
              </View>
            ) : null
          }
          contentContainerStyle={{paddingBottom: 20}}
        />
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
    fontWeight: 700,
    fontSize: 20,
    color: '#FFFFFF',
  },
});
