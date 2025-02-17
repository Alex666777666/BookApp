import {fetchRemoteConfigData} from '../fetchRemoteConfigData';

export const fetchSlides = async () => {
  try {
    const data = await fetchRemoteConfigData();
    return data.top_banner_slides;
  } catch (error) {
    console.error('Error fetching top banner slides:', error);
    return [];
  }
};
