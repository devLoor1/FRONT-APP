import React, { useEffect, useState } from 'react';
import Select from '@/components/Select';
import Input from '@/components/Input';
import RadioButton from '@/components/RadioButton';
import BtnDefault from '@/components/BtnDefault';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';
import CommonMask from '@/helpers/masks';
import { usePlatformAppEntryContent } from '@/features/platform-app/usePlatformAppEntryContent';

interface PersonalDataTwoProps {
  formData: {
    gender: string;
    marital_status: string;
    job: string;
    role: string;
    annual_income: number;
    exposed_politically: number;
  };
  updateFormData: (data: Partial<{
    gender: string;
    marital_status: string;
    job: string;
    role: string;
    annual_income: number;
    exposed_politically: number;
  }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

type SelectProps = {
  list: {
    id: string;
    value: string;
  }[];
};

const gender: SelectProps = {
  list: [
    {
      id: 'male',
      value: 'Homem',
    },
    {
      id: 'female',
      value: 'Mulher',
    }
  ],
};

const civilStatus: SelectProps = {
  list: [
    {
      id: 'single',
      value: 'Solteiro',
    },
    {
      id: 'married',
      value: 'Casado',
    },
    {
      id: 'separated',
      value: 'Separado',
    },
    {
      id: 'divorced',
      value: 'Divorciado',
    },
    {
      id: 'widowed',
      value: 'Viúvo',
    },
    {
      id: 'common_law',
      value: 'União estável',
    },
  ],
};

export default function PersonalDataTwo({ formData, updateFormData, onNext, onPrev }: PersonalDataTwoProps) {
  const content = usePlatformAppEntryContent().completeRegistration;
  const styles = useCustomStyles();
  const [error, setError] = useState({
    gender: '',
    marital_status: '',
    job: '',
    role: '',
    annual_income: '',
    exposed_politically: '',
  });

  const [displayAnnualIncome, setDisplayAnnualIncome] = useState('');

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value });
    
    if (error[field as keyof typeof error]) {
      setError({ ...error, [field]: '' });
    }
  }

  function formatCurrencyForDisplay(value: string): string {
    if (!value) return '';
    
    const numericValue = value.replace(/\D/g, '');
    
    // Converter para número e formatar
    const numberValue = parseFloat(numericValue) / 100;
    return CommonMask.currency(numberValue.toFixed(2));
  }

  function handleAnnualIncomeChange(value: string) {
    const formattedValue = formatCurrencyForDisplay(value);
    setDisplayAnnualIncome(formattedValue);

    // Backend monetary values are integers in centavos. The input's raw digits
    // already represent centavos (for example, 100000 = R$ 1.000,00).
    const valueInCents = Number(value.replace(/\D/g, ''));
    updateFormData({ annual_income: valueInCents });
    
    if (error.annual_income) {
      setError({ ...error, annual_income: '' });
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosPessoaisInfos' });
  }, []);

  function validateFields() {
    const newErrors = {
      gender: !formData.gender ? 'Gênero obrigatório' : '',
      marital_status: !formData.marital_status ? 'Estado civil obrigatório' : '',
      job: !formData.job ? 'Profissão obrigatória' : '',
      role: !formData.role ? 'Função obrigatória' : '',
      annual_income: !formData.annual_income ? 'Faturamento anual obrigatório' : '',
      exposed_politically: formData.exposed_politically === undefined ? 'Campo obrigatório' : '',
    };

    setError(newErrors);
    return Object.values(newErrors).every(error => !error);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosPessoaisInfos_Continuar' });
    
    if (validateFields()) {
      onNext();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.title}>{content.personalDataTitle}</Text>
        
        <Select
          label="Qual o seu gênero *"
          placeholder="Selecione uma opção *"
          value={formData.gender || ''}
          setValue={updateFormData}
          form={formData}
          arr={gender}
          fieldName="gender"
          error={!!error.gender}
          txtError={error.gender}
          marginBottom={48}
        />

        <Select
          label="Estado Civil*"
          placeholder="Selecione uma opção *"
          value={formData.marital_status || ''}
          setValue={updateFormData}
          form={formData}
          arr={civilStatus}
          fieldName="marital_status"
          error={!!error.marital_status}
          txtError={error.marital_status}
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
          placeholder="Função *"
          value={formData.role || ''}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.role), 'role')}
          error={!!error.role}
          txtError={error.role}
          autoCapitalize="words"
        />

        <Input
          placeholder="Faturamento anual *"
          value={displayAnnualIncome}
          setValue={(value) => handleAnnualIncomeChange(typeof value === 'string' ? value : value(displayAnnualIncome))}
          error={!!error.annual_income}
          txtError={error.annual_income}
          keyboardType="numeric"
        />
        <Text style={{ ...styles.subDesc }}>{content.annualIncomeHelper}</Text>

        <View style={{ marginTop: 48 }}>
          <RadioButton
            onValueChange={value => updateFormData({ exposed_politically: value ? 1 : 0 })}
            value={formData.exposed_politically === 1}
            legend="Você é uma pessoa politicamente exposta (PEP)? *"
            error={!!error.exposed_politically}
            txtError={error.exposed_politically}
            data={[
              {
                label: 'Sim, eu sou uma pessoa politicamente exposta',
                value: true,
              },
              {
                label: 'Não, eu não sou uma pessoa politicamente exposta',
                value: false,
              },
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
