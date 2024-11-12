import 'expo-env';

export default {
  expo: {
    name: 'IDBuddy',
    slug: 'idbuddy',
    scheme: 'idbuddy', // URI 스킴 설정
    platforms: ['ios', 'android'],
    version: '1.0.0',
    orientation: 'portrait',

    updates: {
      fallbackToCacheTimeout: 0
    }
  },
  extra: {
    videoUri: process.env.VIDEO_URI,
  },
};