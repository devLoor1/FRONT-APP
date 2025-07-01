import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { Platform } from 'react-native';

export const useCustomStyles = () => {
    const { theme } = useTheme();
    const { width } = Dimensions.get('screen');

    return StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: Platform.OS === 'ios' ? -35 : 0,
            alignItems: 'center',
        },
        borderTop: {
            width: 100,
            height: 7,
            borderRadius: 8,
            marginTop: -2,
            backgroundColor: theme.customColors.baseWhite
        },
        content: {
            flex: 1,
            alignItems: 'center',
            marginTop: 48
        },
        title: {
            fontSize: 28,
            color: theme.customColors.baseWhite,
            fontFamily: theme.fonts.bold
        },
        text: {
            fontSize: 16,
            color: theme.customColors.baseWhite,
            marginTop: 16,
            marginBottom: 6,
            textAlign: 'center',
        },
        iconsBox: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20
        },
        textIcons: {
            fontSize: 16,
            color: theme.customColors.baseWhite,
            marginLeft: 10,
        },
        bold: {
            fontFamily: theme.fonts.bold,
        },
        button: {
            flex: 0.95,
            height: 50
        },
        buttonContainer: {
            marginBottom: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: Platform.OS === 'ios' ? 28 : 22,
            paddingHorizontal: 8
        },
    });
};
