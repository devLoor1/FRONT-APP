/* eslint-disable react/self-closing-comp */
import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/context/MyThemeContext";
import { useCustomStyles } from "./style";
import CommonMask from "@/helpers/masks";
import InfoIcon from "@/../assets/newSvgs/icons/info.svg";
import ArrowUp from "@/../assets/newSvgs/icons/arrow_upward_alt.svg";
import BlurValues from "@/components/BlurValues";
import { useAppSelector } from "@/redux/hooks";
import ModalDefault from "@/components/ModalDefault";
import { useCommon } from "@/context/CommonContext";
import { WalletResponse } from "@/models/investiment/wallet.response";

export default function CardValues({
  resume,
}: {
  resume: WalletResponse["data"];
}) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  // const { resume } = useAppSelector((state) => state.wallet);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const { showBalance } = useCommon();

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View>
          <View style={styles.row}>
            <Text style={styles.title}>Valor investido</Text>
            <TouchableOpacity
              onPress={() => {
                setModalTitle("Total investido");
                setModalDesc(
                  "Exibe o valor total investido, considerando o principal ativo da carteira."
                );
                setShowModal(true);
              }}
            >
              <InfoIcon
                color={theme.customColors.hyperlink}
                width={12}
                height={12}
              />
            </TouchableOpacity>
          </View>
          <BlurValues
            value={(resume?.total_invested / 100).toFixed(2) || "0"}
          />
        </View>
      </View>
      <View style={styles.list}>
        <View style={{ flex: 0.33 }}>
          {/* <View style={styles.row}>
            <Text style={styles.itemTitle}>Lucro projetado</Text>
            <TouchableOpacity
              onPress={() => {
                setModalTitle('Lucro projetado');
                setModalDesc(
                  'Exibe o valor total investido, considerando o principal ativo da carteira.'
                );
                setShowModal(true);
              }}>
              <InfoIcon color={theme.customColors.hyperlink} width={12} height={12} />
            </TouchableOpacity>
          </View> */}
          {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Text style={{ ...styles.itemValue }}>
              R${" "}
              {showBalance
                ? CommonMask.currency(resume?.expectedProfit?.toFixed(2) || "0")
                : "-"}
            </Text>
            <ArrowUp
              width={12}
              height={12}
              color={theme.customColors.risk.default}
            />
          </View> */}
        </View>
        {/* <View style={{ flex: 0.33, alignItems: "center" }}>
          <View style={styles.row}>
            <Text style={styles.itemTitle}>Valor à Receber</Text>
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
                    resume?.totalValueToReceive.toFixed(2) || "0"
                  )
                : "-"}
            </Text>
            <ArrowUp
              width={12}
              height={12}
              color={theme.customColors.risk.default}
            />
          </View>
        </View> */}
        <View style={{ flex: 0.33, alignItems: "flex-end" }}>
          {/* <View style={styles.row}>
            <Text style={styles.itemTitle}>T.I.R</Text>
            <TouchableOpacity
              onPress={() => {
                setModalTitle("Taxa Interna de Retorno - T.I.R");
                setModalDesc(
                  "TIR reflete o retorno efetivo obtido em relação ao capital investido, sendo um indicador essencial para avaliar a eficiência dos investimentos."
                );
                setShowModal(true);
              }}
            >
              <InfoIcon
                color={theme.customColors.hyperlink}
                width={12}
                height={12}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.itemValue,
              { color: theme.customColors.neutrals[500] },
            ]}
          >
            {showBalance
              ? CommonMask.percent(resume?.tir?.toFixed(2).toString() || "0")
              : "-"}
            %
          </Text> */}
        </View>
      </View>
      <ModalDefault
        setVisible={setShowModal}
        visible={showModal}
        title={modalTitle}
        desc={modalDesc}
      />
    </View>
  );
}
