/* eslint-disable react/self-closing-comp */
import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/context/MyThemeContext";
import { useCustomStyles } from "./style";
import CommonMask from "@/helpers/masks";
import ArrowUp from "@/../assets/newSvgs/icons/arrow_upward_alt.svg";
import { useCommon } from "@/context/CommonContext";
import { WalletResponse } from "@/models-old/investiment/wallet.response";
import EyeIcon from "@/../assets/newSvgs/icons/visibility.svg";
import EyeOffIcon from "@/../assets/newSvgs/icons/visibility_off.svg";

export default function CardValues({
  resume,
  title,
}: {
  resume?: WalletResponse["data"];
  title: string;
}) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { showBalance, toogleBalance } = useCommon();

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View>
          <View style={[styles.row, styles.spaceBetween]}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={toogleBalance}>
              {showBalance ? (
                <EyeIcon
                  width={18}
                  height={18}
                  color={theme.customColors.neutrals[500]}
                />
              ) : (
                <EyeOffIcon
                  width={18}
                  height={18}
                  color={theme.customColors.neutrals[500]}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.itemTitle,
              { fontSize: 20, fontFamily: theme.fonts.bold },
            ]}
          >
            {resume?.total_investments || 0}
          </Text>
        </View>
      </View>
      <View style={styles.list}>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.itemTitle}>
              Patrimônio estimado
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ ...styles.itemValue }}>
              R${" "}
              {showBalance
                ? CommonMask.currency(
                    ((resume?.estimated_patrimony || 0) / 100).toFixed(2)
                  )
                : "-"}
            </Text>
            <ArrowUp
              width={12}
              height={12}
              color={theme.customColors.risk.default}
            />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Total investido</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Text style={styles.itemValue}>
              R${" "}
              {showBalance
                ? CommonMask.currency(
                    ((resume?.total_invested || 0) / 100).toFixed(2)
                  )
                : "-"}
            </Text>
            <ArrowUp
              width={12}
              height={12}
              color={theme.customColors.risk.default}
            />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <View style={styles.row}>
            <Text style={[styles.itemTitle, { textAlign: "right" }]}>
              Total recebido
            </Text>
          </View>
          <Text
            style={[
              styles.itemValue,
              { color: theme.customColors.neutrals[500] },
            ]}
          >
            R${" "}
            {showBalance
              ? CommonMask.currency(
                  ((resume?.total_received || 0) / 100).toFixed(2)
                )
              : "-"}
          </Text>
        </View>
      </View>
    </View>
  );
}
