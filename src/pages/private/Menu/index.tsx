import { View, Text, TouchableOpacity, ScrollView, FlatList, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import HeaderDefault from '../../../components/HeaderDefault';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomStyles } from './style';
import CommonMask from '../../../helpers/masks';
import AccountIcon from '@/../assets/newSvgs/icons/account_circle.svg';
import ProfileIcon from '@/../assets/newSvgs/icons/clinical_notes.svg';
import KeyIcon from '@/../assets/newSvgs/icons/Key.svg';
import PaidIcon from '@/../assets/newSvgs/icons/Paid.svg';
import ReceiptLongIcon from '@/../assets/newSvgs/icons/ReceiptLong.svg';
import DeleteIcon from '@/../assets/newSvgs/icons/Delete.svg';
import LogoutIcon from '@/../assets/newSvgs/icons/Logout.svg';
import FAQIcon from '@/../assets/newSvgs/icons/help.svg';
import LockIcon from '@/../assets/newSvgs/icons/lock.svg';
import FingerIcon from '@/../assets/newSvgs/icons/Biometria.svg';
import ArrowIcon from '@/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/MyThemeContext';
import { useAppSelector } from '@/redux/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import UserIcon from '@/../assets/newSvgs/icons/account_circle.svg';
import { Analytics } from '@/helpers/analytics';
import Version from '@/helpers/version/version';

type MenuProps = {
  title: string;
  desc: string;
  icon: React.JSX.Element;
  link: any;
  profile?: string;
  needLogin: boolean;
  analytics: string;
}[];

export default function MenuPage() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { onSignOut } = useAuth();
  const { userStatus, userPicture } = useAppSelector(state => state.user);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const { profileStatus } = useAppSelector(state => state.investor);

  useEffect(() => {
    Analytics({ pageName: 'MinhaContaPerfil' });
  }, []);

  const menu: MenuProps = [
    {
      title: 'Meu perfil',
      desc: 'Altere seus dados, foto e outros detalhes',
      icon: <AccountIcon color={theme.colors.text} width={30} height={30} />,
      link: 'Profile',
      needLogin: false,
      analytics: 'MinhaContaPerfil_MeuPerfil',
    },
    // {
    //   title: 'Perfil de investidor',
    //   desc: profileStatus?.profileInvestor
    //     ? 'Seu perfil atualmente é: '
    //     : 'Defina seu perfil de investidor',
    //   profile: profileStatus?.profileInvestor || '',
    //   icon: <ProfileIcon color={theme.colors.text} width={30} height={30} />,
    //   link: 'InvestorProfile',
    //   needLogin: true,
    //   analytics: 'MinhaContaPerfil_PerfilDeInvestidor',
    // },
    {
      title: 'Alterar senha',
      desc: 'Alterar senha e dados de acesso',
      icon: <KeyIcon color={theme.colors.text} width={30} height={30} />,
      link: 'ChangePassword',
      needLogin: true,
      analytics: 'MinhaContaPerfil_AlterarSenha',
    },
    {
      title: 'Dados bancários',
      desc: 'Alterar seus dados bancários',
      icon: <PaidIcon color={theme.colors.text} width={30} height={30} />,
      link: 'EditAccount',
      needLogin: true,
      analytics: 'MinhaContaPerfil_DadosBancarios',
    },
    // {
    //   title: 'Central de cobranças',
    //   desc: 'Informações sobre pagamentos pendentes',
    //   icon: <ReceiptLongIcon color={theme.colors.text} width={30} height={30} />,
    //   link: 'BillingCenter',
    //   needLogin: true,
    //   analytics: 'MinhaContaPerfil_CentralDeCobrancas',
    // },
    // {
    //   title: 'FAQ',
    //   desc: 'Suas dúvidas reunidas em um só local',
    //   icon: <FAQIcon color={theme.colors.text} width={30} height={30} />,
    //   link: 'FAQ',
    //   needLogin: false,
    //   analytics: 'MinhaContaPerfil_FAQ',
    // },
    // {
    //   title: 'Privacidade',
    //   desc: 'Solicite informações sobre sua conta e gerencia suas notificações',
    //   icon: <LockIcon color={theme.colors.text} width={30} height={30} />,
    //   link: 'SettingsNotification',
    //   needLogin: true,
    //   analytics: 'MinhaContaPerfil_Privacidade',
    // },
    // {
    //   title: 'Biometria e reconhecimento facial',
    //   desc: 'Habilite o acesso e transações por biometria',
    //   icon: <FingerIcon color={theme.colors.text} width={30} height={30} />,
    //   link: 'SettingsAuth',
    //   needLogin: true,
    //   analytics: 'MinhaContaPerfil_BiometriaFacial',
    // },
    {
      title: 'Encerrar conta',
      desc: 'Ao excluir sua conta, todos os seus dados serão permanentemente removidos',
      icon: <DeleteIcon color={theme.colors.text} width={30} height={30} />,
      link: 'RemoveAccount',
      needLogin: true,
      analytics: 'MinhaContaPerfil_EncerrarConta',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderDefault back title="Minha Conta" contact help analytics="MinhaContaPerfil" />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.head}>
              <View style={styles.photo}>
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
              </View>
              {userStatus && (
                <View>
                  <Text style={styles.headName}>Olá, {userStatus.valueFields.name}</Text>
                  {userStatus.valueFields.cpf && (
                    <Text style={styles.headDoc}>
                      CPF {CommonMask.hideCpf(userStatus.valueFields.cpf)}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <FlatList
              data={menu}
              scrollEnabled={false}
              renderItem={({ item }) => {
                if (!item.needLogin || (item.needLogin && userStatus?.status === 'Aprovado')) {
                  return (
                    <TouchableOpacity
                      style={styles.card}
                      key={item.title}
                      onPress={() => {
                        Analytics({ eventName: item.analytics });
                        nav.navigate(item.link);
                      }}>
                      <View style={styles.cardIcon}>{item.icon}</View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardDesc}>
                          {item.desc}{' '}
                          {item.profile && (
                            <Text style={{ color: theme.customColors.secondary[500] }}>
                              {item.profile}
                            </Text>
                          )}
                        </Text>
                      </View>
                      <ArrowIcon color={theme.colors.text} />
                    </TouchableOpacity>
                  );
                } else {
                  return <></>;
                }
              }}
            />
            <TouchableOpacity
              style={styles.btnExit}
              onPress={() => {
                Analytics({ eventName: 'MinhaContaPerfil_SairAplicativo' });
                onSignOut();
              }}>
              <LogoutIcon
                width={20}
                height={20}
                color={
                  theme.dark ? theme.customColors.error.default : theme.customColors.error[300]
                }
              />
              <Text style={styles.btnExitTxt}>Sair do aplicativo</Text>
            </TouchableOpacity>
            <View style={styles.borderBottom} />
            <Text style={styles.version}>Versão {Version()}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
