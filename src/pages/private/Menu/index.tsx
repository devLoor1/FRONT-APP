import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";
import HeaderDefault from "../../../components/HeaderDefault";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomStyles } from "./style";
import CommonMask from "../../../helpers/masks";
import AccountIcon from "@/../assets/newSvgs/icons/account_circle.svg";
import ProfileIcon from "@/../assets/newSvgs/icons/clinical_notes.svg";
import KeyIcon from "@/../assets/newSvgs/icons/Key.svg";
import PaidIcon from "@/../assets/newSvgs/icons/Paid.svg";
import ReceiptLongIcon from "@/../assets/newSvgs/icons/ReceiptLong.svg";
import DeleteIcon from "@/../assets/newSvgs/icons/Delete.svg";
import LogoutIcon from "@/../assets/newSvgs/icons/Logout.svg";
import FAQIcon from "@/../assets/newSvgs/icons/help.svg";
import LockIcon from "@/../assets/newSvgs/icons/lock.svg";
import FingerIcon from "@/../assets/newSvgs/icons/Biometria.svg";
import ArrowIcon from "@/../assets/newSvgs/icons/keyboard_arrow_right.svg";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/context/MyThemeContext";
import { useAppSelector } from "@/redux/hooks";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/models/routes/navigation.private";
import UserIcon from "@/../assets/newSvgs/icons/account_circle.svg";
import { Analytics } from "@/helpers/analytics";
import Version from "@/helpers/version/version";

type MenuProps = {
  title: string;
  desc: string;
  icon: React.JSX.Element;
  link: any;
  profile?: string;
  analytics: string;
}[];

export default function Menu() {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { onSignOut } = useAuth();
  const { userPicture } = useAppSelector((state) => state.user);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Analytics({ pageName: "MinhaContaPerfil" });
  }, []);

  const menu: MenuProps = [
    // {
    //   title: "Meu perfil",
    //   desc: "Altere seus dados e outros detalhes",
    //   icon: <AccountIcon color={theme.colors.text} width={30} height={30} />,
    //   link: "Profile",
    //   analytics: "MinhaContaPerfil_MeuPerfil",
    // },
    // {
    //   title: "Alterar senha",
    //   desc: "Alterar senha e dados de acesso",
    //   icon: <KeyIcon color={theme.colors.text} width={30} height={30} />,
    //   link: "ChangePassword",
    //   analytics: "MinhaContaPerfil_AlterarSenha",
    // },
    // {
    //   title: "Dados bancários",
    //   desc: "Alterar seus dados bancários",
    //   icon: <PaidIcon color={theme.colors.text} width={30} height={30} />,
    //   link: "EditAccount",
    //   analytics: "MinhaContaPerfil_DadosBancarios",
    // },
    {
      title: "Encerrar conta",
      desc: "Ao excluir sua conta, todos os seus dados serão permanentemente removidos",
      icon: <DeleteIcon color={theme.colors.text} width={30} height={30} />,
      link: "RemoveAccount",
      analytics: "MinhaContaPerfil_EncerrarConta",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <HeaderDefault
        back
        title="Minha Conta"
        analytics="MinhaContaPerfil"
      />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.head}>
              <View style={styles.photo}>
                {userPicture?.bucketPath ? (
                  <ImageBackground
                    source={{ uri: userPicture?.bucketPath }}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 52,
                      overflow: "hidden",
                    }}
                  />
                ) : (
                  <UserIcon
                    color={theme.customColors.baseWhite}
                    width={32}
                    height={32}
                  />
                )}
              </View>
              {user && (
                <View>
                  <Text style={styles.headName}>
                    Olá, {user.full_name}
                  </Text>
                </View>
              )}
            </View>
            <FlatList
              data={menu}
              scrollEnabled={false}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.card}
                    key={item.title}
                    onPress={() => {
                      Analytics({ eventName: item.analytics });
                      nav.navigate(item.link);
                    }}
                  >
                    <View style={styles.cardIcon}>{item.icon}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDesc}>
                        {item.desc}{" "}
                        {item.profile && (
                          <Text
                            style={{ color: theme.customColors.secondary[500] }}
                          >
                            {item.profile}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <ArrowIcon color={theme.colors.text} />
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.btnExit}
              onPress={() => {
                Analytics({ eventName: "MinhaContaPerfil_SairAplicativo" });
                onSignOut();
              }}
            >
              <LogoutIcon
                width={20}
                height={20}
                color={
                  theme.dark
                    ? theme.customColors.error.default
                    : theme.customColors.error[300]
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
