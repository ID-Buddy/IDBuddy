import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import { DbProvider } from '@/context/DbContext';
import { SearchContextProvider } from '@/context/SearchContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Prompt: require('../assets/fonts/Prompt-Regular.ttf'),
    Propmt_SemiBold : require('../assets/fonts/Prompt-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DbProvider>
        <SearchContextProvider>  
          <Stack>
              <Stack.Screen 
                name="(tabs)"
                options={{headerShown: false}}
              />
              <Stack.Screen 
                name="register"
                options={{
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="profile"
                options={{}} 
              />
              <Stack.Screen 
                name="editprofile"
                options={{}}
              />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SearchContextProvider>
      </DbProvider>
    </ThemeProvider>
  );
}
