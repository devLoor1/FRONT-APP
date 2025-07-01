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
        },
        messageBox: {
            flex: 1,
            marginTop: 10,
            marginBottom: 15,
            paddingHorizontal: 16,
            justifyContent: 'center'
        },
        messageExtract: {
            color: theme.dark ? '#FFF' : theme.customColors.baseBlack,
            fontFamily: theme.fonts.bold,
            fontSize: 18,
        },
        content: {
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
            flex: 1,
            width: width,
            alignSelf: 'center',
        },
        titleBox: {
            paddingHorizontal: 16,
            paddingVertical: 20,
            borderBottomWidth: 1,
            backgroundColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.baseWhite,
            borderColor: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals.default
        },
        titleSection: {
            fontFamily: theme.fonts.bold,
            fontSize: 17,
            color: theme.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack
        },
        ItemBox: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderColor: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.neutrals.default
        },
        textItem: {
            color: theme.dark ? theme.customColors.baseWhite : theme.customColors.baseBlack,
            fontSize: 16
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
