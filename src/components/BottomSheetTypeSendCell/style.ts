import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        title: {
            color: theme.customColors.baseWhite,
            textAlign: 'center',
            fontFamily: theme.fonts.bold,
            fontSize: 28,
            marginBottom: 24,
            marginTop: 40,
        },
        desc: {
            color: theme.customColors.baseWhite,
            textAlign: 'center',
            fontFamily: theme.fonts.regular,
            fontSize: 14,
            marginHorizontal: 'auto',
            marginBottom: 24,
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
            borderRadius: 8,
            marginBottom: 16,
            gap: 16,
            height: 100,
        },
        optionDesc: {
            color: theme.colors.text,
            fontSize: 14,
            fontFamily: theme.fonts.regular,
        },
        optionValue: {
            color: theme.colors.text,
            fontSize: 14,
            fontFamily: theme.fonts.bold,
        },
        change: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
        },
        changeTxt: {
            color: theme.customColors.baseWhite,
            fontFamily: theme.fonts.bold,
            fontSize: 14,
            marginLeft: 8,
        },
        cell: {
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
            borderRadius: 12,
        },
        focusCell: {},
        cellTxt: {
            fontSize: 20,
            textAlign: 'center',
            height: 55,
            width: 44,
            lineHeight: 55,
            fontFamily: theme.fonts.bold,
            color: theme.dark ? theme.customColors.neutrals[200] : theme.colors.text,
        },
        sendAgainRow: {
            flexDirection: 'row',
            marginTop: 16,
            marginBottom: 24,
        },
        timer: {
            color: theme.customColors.baseWhite,
            fontSize: 14,
            fontFamily: theme.fonts.semiBold,
        },
        sendAgainTxt: {
            color: theme.customColors.baseWhite,
            fontSize: 14,
            fontFamily: theme.fonts.semiBold,
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        },
    });
};
