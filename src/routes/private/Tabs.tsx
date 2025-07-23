import React from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { TouchableOpacity, View } from "react-native";
import OpportunityIcon from "~/../assets/newSvgs/icons/monitoring.svg";
import WalletIcon from "~/../assets/newSvgs/icons/account_balance_wallet.svg";
import HomeIcon from "~/../assets/newSvgs/icons/home.svg";
import { useTheme } from "@/context/MyThemeContext";
import WalletPage from "@/pages/private/Wallet";
import OpportunitiesPage from "@/pages/private/Opportunities";
import InvestmentPage from "@/pages/private/Investments";
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
  const { bottom } = useSafeAreaInsets();

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
        bottom: 16 + bottom,
        zIndex: 0,
        borderRadius: 32,
        elevation: 3,
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOffset: { width: -1, height: 3 },
        shadowRadius: 32,
        shadowOpacity: 0.15,
        height: "height" in tabBarStyle ? tabBarStyle["height"] : "auto",
      }}
    >
      <View
        style={{
          backgroundColor: theme.customColors.secondary.default,
          padding: 8,
          gap: 16,
          borderRadius: 32,
          flexDirection: "row",
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
                <HomeIcon
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
                <WalletIcon
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

  return (
    <Tab.Navigator
      initialRouteName="HomeTabs"
      tabBar={(props: any) => <MyTabBar {...props} theme={theme} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 56,
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
        component={InvestmentPage}
        options={{ tabBarLabel: "bank-outline" }}
      />
    </Tab.Navigator>
  );
}
