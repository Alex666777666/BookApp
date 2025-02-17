import {fetchRemoteConfigData} from '../fetchRemoteConfigData';

export const fetchBooks = async () => {
  try {
    const data = await fetchRemoteConfigData();
    return data.books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};
