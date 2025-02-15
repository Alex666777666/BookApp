import React, {useRef, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  SectionList,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Swiper from 'react-native-swiper';

const ITEM_WIDTH = 122;

const LoopingFlatList = ({data}) => {
  const flatListRef = useRef(null);
  const repositioningRef = useRef(false);

  const extendedData = useMemo(() => [...data, ...data, ...data], [data]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: data.length * ITEM_WIDTH,
        animated: false,
      });
    }
  }, [data]);

  const handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.x;
    const totalItems = data.length;
    const totalDataWidth = totalItems * ITEM_WIDTH;

    if (!repositioningRef.current) {
      if (offset < totalItems * ITEM_WIDTH) {
        repositioningRef.current = true;
        flatListRef.current.scrollToOffset({
          offset: offset + totalDataWidth,
          animated: false,
        });
        setTimeout(() => {
          repositioningRef.current = false;
        }, 50);
      } else if (offset >= totalItems * ITEM_WIDTH * 2) {
        repositioningRef.current = true;
        flatListRef.current.scrollToOffset({
          offset: offset - totalDataWidth,
          animated: false,
        });
        setTimeout(() => {
          repositioningRef.current = false;
        }, 50);
      }
    }
  };

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      data={extendedData}
      keyExtractor={(item, index) => item.id + '-' + index}
      renderItem={({item}) => (
        <TouchableOpacity style={styles.bookItem}>
          <View style={styles.bookCover} />
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      getItemLayout={(data, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
    />
  );
};

export const LibraryScreen = () => {
  const {width} = Dimensions.get('window');
  const smallDevice = width <= 375;

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
    }, 1500);
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
            <View>
              <View style={{height: smallDevice ? 160 : 200, marginBottom: 20}}>
                <Swiper
                  loop
                  dotColor="#c1c2ca"
                  activeDotColor="#D0006E"
                  paginationStyle={{bottom: 2}}
                  containerStyle={styles.swiperWrapper}>
                  {slidesData.map(item => (
                    <Pressable key={item.id} style={styles.slide}>
                      <Image
                        source={item.source}
                        style={styles.slideImage}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </Swiper>
              </View>
            </View>
          }
          renderItem={({item}) => <LoopingFlatList data={item} />}
          renderSectionHeader={({section}) => (
            <View style={{marginVertical: 8}}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && (
              <View style={{paddingVertical: 20}}>
                <ActivityIndicator size="large" color="#D0006E" />
              </View>
            )
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
  swiperWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  slide: {},
  slideImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: 700,
    fontSize: 20,
    color: '#FFFFFF',
  },
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
    fontWeight: 600,
    fontSize: 16,
    color: '#FFFFFFB2',
  },
});
