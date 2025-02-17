import remoteConfig from '@react-native-firebase/remote-config';

export const fetchRemoteConfigData = async () => {
  await remoteConfig().setDefaults({
    json_data: JSON.stringify({
      books: [],
      top_banner_slides: [],
      you_will_like_section: [],
    }),
  });

  await remoteConfig().fetchAndActivate();

  const allValues = remoteConfig().getAll();

  const rawJson = allValues['json_data']?.asString() || '{}';
  return JSON.parse(rawJson);
};
