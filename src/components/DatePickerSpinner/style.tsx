import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
    const { theme } = useTheme();
    const { height } = Dimensions.get('window');

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
        },

        itemContainer: {
            height: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
        },
        selectedItemContainer: {
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
        },
        itemText: {
            color: theme.dark ? '#FFF' : theme.customColors.neutrals[500],
            fontSize: 22,
        },
        selectedItemText: {
            color: theme.dark ? '#FFF' : theme.customColors.baseBlack,
            fontFamily: theme.fonts.semiBold,
            fontSize: 24,
        },

        selectedItemTextBold: {
            fontFamily: theme.fonts.bold,
        },
    });
};
