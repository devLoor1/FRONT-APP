import { SetStateAction, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";
import useCustomStyles from "./style";
import Input from "@/components/Input";
import BtnDefault from "@/components/BtnDefault";
import { Analytics } from "@/helpers/analytics";
import { SceneRendererProps } from "react-native-tab-view";
import CommonMask from "@/helpers/masks";
import { useQuery } from "@tanstack/react-query";
import { getTotalInvestments } from "@/services/investments";
import { InvestmentRequest } from "@/models/investments/investment.request";
import { SafeAreaView } from "react-native-safe-area-context";
import { declaration } from "@/utils/options";

type CrowdfundingTabProps = {
  onNext: (data: Partial<InvestmentRequest>) => void;
} & SceneRendererProps;

const CrowdfundingTab: React.FC<CrowdfundingTabProps> = (props) => {
  const styles = useCustomStyles();
  const [value, setValue] = useState("");
  const [investmentThis, setInvestmentThis] = useState("");
  const [investmentOther, setInvestmentOther] = useState("");
  const [checked, setChecked] = useState(false);
  const { data: totalInvestment } = useQuery({
    queryKey: [getTotalInvestments.name],
    queryFn: getTotalInvestments,
  });

  const disabled = !checked || !value || !investmentOther;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Declaração do perfil do investidor</Text>
        <RadioButton.Group onValueChange={setValue} value={value}>
          <View style={styles.radioContainer}>
            {Object.entries(declaration).map(([option, value]) => (
              <View style={styles.radioItemContainer} key={option}>
                <RadioButton.Item
                  mode="android"
                  value={option}
                  style={styles.radio}
                  labelStyle={styles.radioLabel}
                  label={value}
                />
              </View>
            ))}
          </View>
        </RadioButton.Group>
        <Text style={styles.title}>Investimentos feitos nesta plataforma</Text>
        <Input
          disabled
          placeholder="Valor de investimentos R$"
          value={
            "R$ " +
            CommonMask.currency(
              (totalInvestment?.total_invested || 0).toString()
            )
          }
          setValue={() => null}
        />
        <Text style={styles.title}>
          Investimento feitos em outras plataformas no ano atual
        </Text>
        <Input
          placeholder="Valor de investimentos R$"
          keyboardType="numeric"
          mask="currency"
          value={
            investmentOther ? "R$ " + CommonMask.currency(investmentOther) : ""
          }
          setValue={setInvestmentOther}
        />
        <Checkbox.Item
          mode="android"
          rippleColor="transparent"
          onPress={() => setChecked(!checked)}
          status={checked ? "checked" : "unchecked"}
          label="Li e estou de acordo com os Termos de Riscos."
          style={styles.checkbox}
          labelStyle={styles.checkboxLabelStyle}
        />
      </View>
      <View>
        <BtnDefault
          label="Avançar"
          disabled={disabled}
          onPress={() => {
            if (!value || !investmentOther) return;

            Analytics({
              eventName: "OportInvestirAgora_ConfirmaCrowdfunding",
            });
            props.jumpTo("summary");
            props.onNext({
              other_crowdfunding_platforms: +investmentOther.replace(",", "."),
              declaration: value,
            });
          }}
        />
      </View>
    </ScrollView>
  );
};

export default CrowdfundingTab;
