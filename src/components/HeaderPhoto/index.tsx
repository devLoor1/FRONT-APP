/* eslint-disable react/self-closing-comp */
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React from 'react';
import { useCustomStyles } from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/MyThemeContext';
import UserIcon from '@/../assets/newSvgs/icons/account_circle.svg';
import FAQIcon from '@/../assets/newSvgs/icons/help.svg';
import HelpIcon from '@/../assets/newSvgs/icons/forum.svg';
import { useAuth } from '@/context/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { Analytics } from '@/helpers/analytics';
import { useAppSelector } from '@/redux/hooks';

type HeaderProps = {
  analytics?: string;
};

export default function HeaderPhoto({ analytics }: HeaderProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { userPicture } = useAppSelector(state => state.user);

  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.photo}
            onPress={() => {
              Analytics({ eventName: `${analytics}_MinhaContaPerfil` });
              // nav.navigate('Menu'); // TODO: Criar página Menu
              console.log('Menu não implementado ainda');
            }}>
            {userPicture?.bucketPath ? (
              <ImageBackground
                source={{ uri: userPicture?.bucketPath }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 52,
                  overflow: 'hidden',
                }}
              />
            ) : (
              <UserIcon color={theme.customColors.baseWhite} width={32} height={32} />
            )}
          </TouchableOpacity>
          <View style={styles.options}>
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: `${analytics}_PrecisaDeAjuda` });
                // nav.navigate('FAQ'); // TODO: Implementar página FAQ
                console.log('FAQ não implementado ainda');
              }}>
              <FAQIcon color={theme.customColors.baseWhite} width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Analytics({ eventName: `${analytics}_Contato` });
                // nav.navigate('Contact'); // TODO: Implementar página Contact
                console.log('Contact não implementado ainda');
              }}>
              <HelpIcon color={theme.customColors.baseWhite} width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.name}>Olá, {user?.name}</Text>
      </SafeAreaView>
    </View>
  );
}
