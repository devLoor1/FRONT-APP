import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';
import RadioButton from '@/components/RadioButton';
import BtnDefault from '@/components/BtnDefault';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';
import CommonMask from '@/helpers/masks';

interface PersonalDataTwoProps {
  formData: {
    company: string;
    job: string;
    role: string;
    annual_income: number;
    exposed_politically: number;
  };
  updateFormData: (data: Partial<{
    company: string;
    job: string;
    role: string;
    annual_income: number;
    exposed_politically: number;
  }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PersonalDataTwo({ formData, updateFormData, onNext, onPrev }: PersonalDataTwoProps) {
  const styles = useCustomStyles();
  const [error, setError] = useState({
    job: '',
    role: '',
    annual_income: '',
    exposed_politically: '',
  });

  const [displayAnnualIncome, setDisplayAnnualIncome] = useState('');

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value });
    if (error[field as keyof typeof error]) {
      setError(prev => ({ ...prev, [field]: '' }));
    }
  }

  function formatCurrencyForDisplay(value: string): string {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    const numberValue = parseFloat(numericValue) / 100;
    return isNaN(numberValue) ? '' : CommonMask.currency(numberValue.toFixed(2));
  }

  function formatCurrencyForAPI(value: string): number {
    if (!value) return 0;
    const numericValue = value.replace(/\D/g, '');
    return parseFloat(numericValue) / 100 || 0;
  }

  function handleAnnualIncomeChange(value: string) {
    const formattedValue = formatCurrencyForDisplay(value);
    setDisplayAnnualIncome(formattedValue);
    updateFormData({ annual_income: formatCurrencyForAPI(value) });
    if (error.annual_income) {
      setError(prev => ({ ...prev, annual_income: '' }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosProfissionais' });
  }, []);

  function validateFields() {
    const newErrors = {
      job: !formData.job ? 'Profissão obrigatória' : '',
      role: !formData.role ? 'Cargo obrigatório' : '',
      annual_income: !formData.annual_income ? 'Renda anual obrigatória' : '',
      exposed_politically: formData.exposed_politically === undefined ? 'Campo obrigatório' : '',
    };
    setError(newErrors);
    return Object.values(newErrors).every(e => !e);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosProfissionais_Continuar' });
    if (validateFields()) {
      onNext();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.title}>Dados Profissionais</Text>

        <Input
          placeholder="Empresa"
          value={formData.company || ''}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.company), 'company')}
          autoCapitalize="words"
        />

        <Input
          placeholder="Profissão *"
          value={formData.job || ''}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.job), 'job')}
          error={!!error.job}
          txtError={error.job}
          autoCapitalize="words"
        />

        <Input
          placeholder="Cargo *"
          value={formData.role || ''}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.role), 'role')}
          error={!!error.role}
          txtError={error.role}
          autoCapitalize="words"
        />

        <Input
          placeholder="Renda anual *"
          value={displayAnnualIncome}
          setValue={(value) => handleAnnualIncomeChange(typeof value === 'string' ? value : value(displayAnnualIncome))}
          error={!!error.annual_income}
          txtError={error.annual_income}
          keyboardType="numeric"
        />
        <Text style={{ ...styles.subDesc, marginBottom: 16 }}>Ex.: R$ 50.000,00</Text>

        <View style={{ marginTop: 32 }}>
          <RadioButton
            onValueChange={value => updateFormData({ exposed_politically: value ? 1 : 0 })}
            value={formData.exposed_politically === 1}
            legend="Você é uma pessoa politicamente exposta (PEP)? *"
            error={!!error.exposed_politically}
            txtError={error.exposed_politically}
            data={[
              { label: 'Sim, sou uma pessoa politicamente exposta', value: true },
              { label: 'Não, não sou uma pessoa politicamente exposta', value: false },
            ]}
          />
        </View>
      </View>

      <BtnDefault
        label="Continuar"
        onPress={onConfirm}
        style={{ marginBottom: 15 }}
      />
    </View>
  );
}
