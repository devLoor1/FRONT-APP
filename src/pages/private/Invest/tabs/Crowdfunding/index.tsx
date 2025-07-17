import { SetStateAction, useState } from "react";
import { Text, View } from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";
import useCustomStyles from "./style";
import Input from "@/components/Input";
import BtnDefault from "@/components/BtnDefault";
import { Analytics } from "@/helpers/analytics";
import { SceneRendererProps } from "react-native-tab-view";
import CommonMask from "@/helpers/masks";

type CrowdfundingTabProps = {
  onNext: () => void;
} & SceneRendererProps;

const CrowdfundingTab: React.FC<CrowdfundingTabProps> = (props) => {
  const styles = useCustomStyles();
  const [value, setValue] = useState("");
  const [investmentThis, setInvestmentThis] = useState("");
  const [investmentOther, setInvestmentOther] = useState("");
  const [checked, setChecked] = useState(false);

  const disabled = !checked || !value || !investmentThis || !investmentOther;

  return (
    <View style={{ flex: 1, justifyContent: "space-between", padding: 16 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Declaração do perfil do investidor</Text>
        <RadioButton.Group onValueChange={setValue} value={value}>
          <View style={styles.radioContainer}>
            <RadioButton.Item
              mode="android"
              value="first"
              style={styles.radio}
              labelStyle={styles.radioLabel}
              label="Possuo investimento financeiro ou renda bruta anual em valor inferior ou igual a R$ 200 mil"
            />
            <RadioButton.Item
              mode="android"
              value="second"
              style={styles.radio}
              labelStyle={styles.radioLabel}
              label="Não possuo investimento financeiro ou renda bruta anual em valor superior a R$ 200 mil. "
            />
            <RadioButton.Item
              mode="android"
              value="third"
              style={styles.radio}
              labelStyle={styles.radioLabel}
              label="Possuo investimento financeiro em valor superior a R$ 1 milhão"
            />
          </View>
        </RadioButton.Group>
        <Text style={styles.title}>Investimentos feitos nesta plataforma</Text>
        <Input
          placeholder="Valor de investimentos R$"
          keyboardType="numeric"
          mask="currency"
          value={CommonMask.currency(investmentThis)}
          setValue={setInvestmentThis}
        />
        <Text style={styles.title}>
          Investimento feitos em outras plataformas no ano atual
        </Text>
        <Input
          placeholder="Valor de investimentos R$"
          keyboardType="numeric"
          mask="currency"
          value={investmentOther}
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
            Analytics({
              eventName: "OportInvestirAgora_ConfirmaCrowdfunding",
            });
            props.jumpTo("summary");
            props.onNext();
          }}
        />
      </View>
    </View>
  );
};

export default CrowdfundingTab;
