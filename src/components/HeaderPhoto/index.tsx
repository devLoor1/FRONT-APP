/* eslint-disable react/self-closing-comp */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/MyThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { useAppSelector } from '@/redux/hooks';
import { Analytics } from '@/helpers/analytics';
import { useCustomStyles } from './style';
import UserIcon from '@/../assets/newSvgs/icons/account_circle.svg';

type HeaderProps = {
  readonly analytics?: string;
};

export default function HeaderPhoto({ analytics }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const styles = useCustomStyles(insets);
  const { theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.photo}
            onPress={() => {
              Analytics({ eventName: `${analytics}_MinhaContaPerfil` });
              nav.navigate('Menu');
            }}>
            <UserIcon color={theme.customColors.baseWhite} width={32} height={32} />
          </TouchableOpacity>
          <Text style={styles.name}>Olá, {user?.full_name}</Text>
        </View>
      </View>
    </View>
  );
}
