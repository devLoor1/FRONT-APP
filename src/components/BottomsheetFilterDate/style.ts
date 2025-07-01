import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';
import { Platform } from 'react-native';

export const useCustomStyles = () => {
    const { theme } = useTheme();
    const { width } = Dimensions.get('screen');

    return StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: Platform.OS === 'ios' ? -35 : 0
        },
        header: {
            marginTop: -5,
            paddingVertical: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.customColors.secondary[600],
        },
        title: {
            color: theme.customColors.baseWhite,
            fontFamily: theme.fonts.bold,
            fontSize: 20,
        },
        btnClose: {
            backgroundColor: theme.customColors.baseWhite,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5
        },

        filterSubtitle: {
            color: theme.dark ? '#FFF' : theme.customColors.secondary.default,
            fontFamily: theme.fonts.bold,
            fontSize: 18,
            paddingHorizontal: 16,
            marginTop: 20
        },
        content: {
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
            flex: 1,
            width: width,
            alignSelf: 'center',
        },
        button: {
            flex: 0.48,
            height: 50
        },

        buttonContainer: {
            marginBottom: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: Platform.OS === 'ios' ? 30 : 24,
            paddingHorizontal: 8
        },
    });
};
