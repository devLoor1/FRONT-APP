// ThemeContext.tsx
import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { darkTheme, lightTheme, Theme } from '../styles/theme';
import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { StatusBar, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createURL } from 'expo-linking';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import { RootStackParamList } from '@/models/routes/navigation';

interface ThemeContextData {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function MyThemeProvider({ children }: { children: ReactNode }) {
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);
  const isDarkMode = useColorScheme() === 'dark';

  const getColorStatusBar = () => {
    if (currentRouteName && currentRouteName !== 'Login' && currentRouteName !== 'Register' && currentRouteName !== 'Caf') {
      return lightTheme.customColors.secondary.default;
    }

    return isDarkMode ? darkTheme.colors.background : lightTheme.customColors.baseWhite;
  };

  const getBarStyle = () => {
    const background = getColorStatusBar();
    const isDark = [Colors.darker, lightTheme.customColors.secondary.default].includes(background);

    if (isDarkMode || isDark) return 'light-content';

    return 'dark-content';
  };

  const url = createURL('/');

  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const theme = isDarkMode ? darkTheme : lightTheme;

  const paperTheme: typeof DefaultTheme = useMemo(
    () => ({
      ...DefaultTheme,
      roundness: 12,
      dark: theme.dark,
      colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background,
        text: theme.colors.text,
        disabled: theme.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
        placeholder: theme.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
      },
      fonts: configureFonts({
        default: {
          thin: { fontFamily: theme.fonts.extraLight, fontWeight: 'normal' },
          light: { fontFamily: theme.fonts.light, fontWeight: 'normal' },
          regular: { fontFamily: theme.fonts.regular, fontWeight: 'normal' },
          medium: { fontFamily: theme.fonts.semiBold, fontWeight: 'normal' },
        },
      }),
    }),
    [theme]
  );

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [url, 'wealthmoney://'],
    config: {
      screens: {
        Tabs: {
          screens: {
            HomeTabs: { path: 'home' },
          },
        },
        OpportunitiesDetail: {
          path: 'detalheOportunidade/:id',
          parse: {
            id: (id: string) => id,
          },
        },
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ theme: theme }}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer<RootStackParamList>
          theme={theme}
          linking={linking}
          ref={navigationRef}
          onReady={() => {
            setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
          }}
          onStateChange={() => {
            setCurrentRouteName(navigationRef.getCurrentRoute()?.name);
          }}>
          <StatusBar barStyle={getBarStyle()} backgroundColor={getColorStatusBar()} />
          {children}
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
