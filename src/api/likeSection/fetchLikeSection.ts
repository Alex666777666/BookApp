import {fetchRemoteConfigData} from '../fetchRemoteConfigData';

export const fetchLikeSection = async () => {
  try {
    const data = await fetchRemoteConfigData();
    return data.you_will_like_section;
  } catch (error) {
    console.error('Error fetching you will like section:', error);
    return [];
  }
};
