import React from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";
import OpportunityIcon from "~/../assets/newSvgs/icons/monitoring.svg";
import WalletIcon from "~/../assets/newSvgs/icons/account_balance_wallet.svg";
import InvestmentIcon from "~/../assets/newSvgs/icons/account_balance.svg";
import { useTheme } from "@/context/MyThemeContext";
import WalletPage from "@/pages/private/Wallet";
import OpportunitiesPage from "@/pages/private/Opportunities";
// import InvestmentPage from '~/pages/private/Investments';
import { Analytics } from "@/helpers/analytics";
import { AppTheme } from "@/styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

function MyTabBar({
  state,
  descriptors,
  navigation,
  theme,
}: BottomTabBarProps & { theme: AppTheme }) {
  const gradientColors = [76, 128, 204, 255].map(
    (alpha) => `${theme.colors.background}${alpha.toString(16)}`
  );
  const tabBarStyle =
    descriptors[state?.routes[state?.index || 0]?.key].options?.tabBarStyle ||
    {};
  const focusedColor = theme.navigation.colors.primary;
  const baseWhite = theme.customColors.baseWhite;

  return (
    <View
      style={{
        position: "absolute",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        paddingBottom: 38,
        height: "height" in tabBarStyle ? tabBarStyle["height"] : 0,
      }}
    >
      <View
        style={{
          backgroundColor: theme.customColors.secondary.default,
          padding: 8,
          gap: 16,
          borderRadius: 32,
          flexDirection: "row",
          elevation: 3,
          shadowColor: "rgba(0, 0, 0, 1)",
          shadowOffset: { width: -1, height: 3 },
          shadowRadius: 32,
          shadowOpacity: 0.15,
        }}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (route.name === "HomeTabs") {
                Analytics({ eventName: "HomeApp_MenuCarteira" });
              }
              if (route.name === "InvestTabs") {
                Analytics({ eventName: "HomeApp_MenuOportunidade" });
              }
              if (route.name === "InvestmentTabs") {
                Analytics({ eventName: "HomeApp_MenuMeusInvestimentos" });
              }
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}
              style={{
                width: 40,
                height: 40,
                backgroundColor: isFocused ? baseWhite : "transparent",
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {route.name === "HomeTabs" && (
                <WalletIcon
                  color={isFocused ? focusedColor : baseWhite}
                  width={32}
                  height={32}
                />
              )}
              {route.name === "InvestTabs" && (
                <OpportunityIcon
                  color={isFocused ? focusedColor : baseWhite}
                  width={32}
                  height={32}
                />
              )}
              {route.name === "InvestmentTabs" && (
                <InvestmentIcon
                  color={isFocused ? focusedColor : baseWhite}
                  width={32}
                  height={32}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function Tabs() {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HomeTabs"
      tabBar={(props: any) => <MyTabBar {...props} theme={theme} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 94 + bottom,
        },
      }}
    >
      <Tab.Screen
        name="HomeTabs"
        component={WalletPage}
        options={{ tabBarLabel: "wallet-outline" }}
      />

      <Tab.Screen
        name="InvestTabs"
        component={OpportunitiesPage}
        options={{ tabBarLabel: "opportunity" }}
      />

      <Tab.Screen
        name="InvestmentTabs"
        component={/* InvestmentPage */ React.Fragment}
        options={{ tabBarLabel: "bank-outline" }}
      />
    </Tab.Navigator>
  );
}
