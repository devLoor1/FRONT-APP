import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';

// Definição dos tipos de cores
export type Colors = typeof customColors & {
  inputBg: string;
  hyperlink: string;
  desc: string;
  placeholder: string;
};

const fonts = {
  extraLight: 'NunitoSans_200ExtraLight',
  light: 'NunitoSans_300Light',
  regular: 'NunitoSans_400Regular',
  semiBold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  extraBold: 'NunitoSans_800ExtraBold',
  black: 'NunitoSans_900Black',
};

const customColors = {
  baseWhite: '#FAFAFA',
  baseBlack: '#39393A',
  primary: {
    default: '#0CA4A5',
    100: '#D8FCFC',
    200: '#B1F9F9',
    300: '#8BF6F7',
    400: '#64F3F4',
    500: '#3DF0F1',
    600: '#16EDEE',
    700: '#0FCBCC',
    800: '#0A8889',
    900: '#086C6D',
    1000: '#065050',
  },
  secondary: {
    default: '#0525CE',
    100: '#D4EBFF',
    200: '#AAD8FE',
    300: '#7FC4FE',
    400: '#54B0FE',
    500: '#299DFE',
    600: '#0289FA',
    700: '#0171D0',
    800: '#014B89',
    900: '#013C6D',
    1000: '#002C51',
  },
  neutrals: {
    default: '#EFEFEF',
    100: '#EFEFEF',
    200: '#E7E7E7',
    300: '#AFAEAE',
    400: '#969595',
    500: '#7E7D7D',
    600: '#666565',
    700: '#504F4F',
    800: '#3C3B3C',
    900: '#2F2E2F',
    1000: '#2D2D2E',
  },
  success: {
    default: '#0CA4A5',
    100: '#98F7F7',
    200: '#30EFF0',
    300: '#097576',
  },
  risk: { default: '#168941', 100: '#996ED0', 200: '', 300: '' },
  warning: {
    default: '#FFC839',
    100: '#FFEDBD',
    200: '#FFDA7B',
    300: '#D99C00',
  },
  error: {
    default: '#EE4848',
    100: '#F9C2C2',
    200: '#F48585',
    300: '#C51212',
  },
};

// Theme para uso interno do app
export interface AppTheme {
  navigation: NavigationTheme;
  customColors: Colors;
  fonts: typeof fonts;
  dark: boolean;
  colors: typeof DefaultTheme.colors;
}

export const lightTheme: AppTheme = {
  navigation: {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: customColors.secondary.default,
      background: customColors.baseWhite,
      text: customColors.baseBlack,
      border: customColors.neutrals[200],
    },
  },
  customColors: {
    ...customColors,
    placeholder: 'rgba(255, 255, 255, 0.3)',
    inputBg: customColors.neutrals[100],
    hyperlink: customColors.secondary.default,
    desc: customColors.neutrals[700],
  },
  fonts,
  dark: false,
  colors: DefaultTheme.colors,
};

export const darkTheme: AppTheme = {
  navigation: {
    ...DarkTheme,
    dark: true,
    colors: {
      ...DarkTheme.colors,
      primary: customColors.secondary.default,
      background: customColors.neutrals[1000],
      text: customColors.baseWhite,
      border: customColors.neutrals[700],
    },
  },
  customColors: {
    ...customColors,
    placeholder: 'rgba(255, 255, 255, 0.3)',
    inputBg: customColors.neutrals[700],
    hyperlink: customColors.secondary[500],
    desc: customColors.neutrals[200],
  },
  fonts,
  dark: true,
  colors: DarkTheme.colors,
}; 