// ThemeContext.tsx
import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { darkTheme, lightTheme, AppTheme } from '../styles/theme';
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
  theme: AppTheme;
}

const ThemeContext = createContext<ThemeContextData>({ theme: lightTheme });

export function MyThemeProvider({ children }: { children: ReactNode }) {
  const [currentRouteName, setCurrentRouteName] = useState<string | undefined>(undefined);
  const isDarkMode = useColorScheme() === 'dark';

  const getColorStatusBar = () => {
    if (currentRouteName && currentRouteName !== 'Login' && currentRouteName !== 'Register' && currentRouteName !== 'Caf') {
      return lightTheme.customColors.secondary.default;
    }

    return isDarkMode ? darkTheme.navigation.colors.background : lightTheme.customColors.baseWhite;
  };

  const getBarStyle = () => {
    const background = getColorStatusBar();
    const isDark = [Colors.darker, lightTheme.customColors.secondary.default].includes(background);

    if (isDarkMode || isDark) return 'light-content';

    return 'dark-content';
  };

  const url = createURL('/');

  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const theme = useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);
  


  const paperTheme: typeof DefaultTheme = useMemo(
    () => ({
      ...DefaultTheme,
      roundness: 12,
      dark: theme.navigation.dark,
      colors: {
        ...DefaultTheme.colors,
        background: theme.navigation.colors.background,
        text: theme.navigation.colors.text,
        disabled: theme.navigation.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
        placeholder: theme.navigation.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
      },
      fonts: configureFonts({
        config: {
          thin: { fontFamily: theme.fonts.extraLight, fontWeight: 'normal', fontSize: 12, letterSpacing: 0, lineHeight: 16 },
          light: { fontFamily: theme.fonts.light, fontWeight: 'normal', fontSize: 14, letterSpacing: 0, lineHeight: 20 },
          regular: { fontFamily: theme.fonts.regular, fontWeight: 'normal', fontSize: 16, letterSpacing: 0, lineHeight: 24 },
          medium: { fontFamily: theme.fonts.semiBold, fontWeight: 'normal', fontSize: 18, letterSpacing: 0, lineHeight: 28 },
        },
      }),
    }),
    [theme]
  );

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [url, 'Loor://'],
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
          theme={theme.navigation}
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
  
  // Garantir que sempre retorne um tema válido
  if (!context || !context.theme || !context.theme.navigation || !context.theme.customColors || !context.theme.fonts) {
    console.warn('Tema inválido no useTheme, usando lightTheme como fallback');
    return { theme: lightTheme };
  }
  
  return context;
};
