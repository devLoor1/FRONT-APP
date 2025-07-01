import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/MyThemeContext';

export const useCustomStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: -16,
      paddingBottom: 24,
    },
    header: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.customColors.secondary[600],
    },
    headTitle: {
      color: theme.customColors.baseWhite,
      fontFamily: theme.fonts.bold,
      fontSize: 18,
    },
    simulationContainer: {
      flexGrow: 1,
      backgroundColor: theme.dark ? theme.customColors.neutrals[800] : '#fff',
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    btnClose: {
      backgroundColor: theme.customColors.baseWhite,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      fontSize: 14,
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    codesRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    code: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.customColors.secondary.default,
    },
    codeTxt: {
      color: theme.customColors.baseWhite,
      fontSize: 12,
      fontFamily: theme.fonts.semiBold,
      paddingHorizontal: 4,
    },
    paramsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    paramsItem: { flex: 1 },
    paramBigTitle: {
      textAlign: 'center',
      marginBottom: 8,
      color: theme.colors.text,
      fontSize: 16,
      fontFamily: theme.fonts.bold,
    },
    quotas: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    input: {
      borderRadius: 4,
      width: 41,
      height: 49,
      textAlign: 'center',
      color: theme.colors.text,
      backgroundColor: theme.dark ? theme.customColors.neutrals[700] : 'transparent',
      fontFamily: theme.fonts.semiBold,
      fontSize: 14,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.secondary[600],
    },
    paramValueBlock: {
      padding: 10,
      backgroundColor: theme.dark ? theme.customColors.neutrals[900] : 'transparent',
      borderRadius: 8,
      flex: 1,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    paramValueTitle: {
      color: theme.dark ? theme.customColors.neutrals[500] : theme.customColors.baseBlack,
      textAlign: 'center',
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    paramValueTxt: {
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary.default,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: theme.fonts.extraBold,
    },
    paramTaxBlock: {
      flex: 1,
      padding: 10,
      borderRadius: 8,
      borderWidth: theme.dark ? 0 : 1,
      borderColor: theme.customColors.neutrals[100],
    },
    paramTaxTitle: {
      color: theme.colors.text,
      textAlign: 'center',
      fontSize: 10,
      fontFamily: theme.fonts.semiBold,
    },
    paramTexTxt: {
      color: theme.dark ? theme.customColors.secondary[500] : theme.customColors.secondary.default,
      textAlign: 'center',
      fontSize: 12,
      fontFamily: theme.fonts.bold,
    },
    list: {
      paddingTop: 16,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: theme.dark ? theme.customColors.neutrals[700] : theme.customColors.neutrals[200],
    },
    listItemTitle: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: theme.fonts.regular,
    },
    listItemDesc: {
      color: theme.colors.text,
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
  });
};
