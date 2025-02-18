import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BookItem} from '../../types/bookItem';

interface BookDetailsProps {
  book: BookItem;
}

const BookDetails: React.FC<BookDetailsProps> = ({book}) => {
  const stats = [
    {label: 'Readers', value: book.views},
    {label: 'Likes', value: book.likes},
    {label: 'Quotes', value: book.quotes},
    {label: 'Genre', value: book.genre},
  ];

  return (
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
        <Text style={styles.summaryText}>{book.summary}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default BookDetails;
