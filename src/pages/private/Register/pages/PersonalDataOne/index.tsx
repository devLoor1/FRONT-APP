import React, { useEffect, useState } from 'react';
import CommonValidators from '@/helpers/validators/common.validators';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
import Select from '@/components/Select';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';
import { getBureauByCpf } from '@/services/common';
import { useMutation } from '@tanstack/react-query';
import Snack from '@/components/Snack';
import LoadingComp from '@/components/Loading';

interface PersonalDataOneProps {
  formData: {
    cpf: string;
    full_name: string;
    birth_date: string;
    rg: string;
    issuing_entity: string;
    nationality: string;
    gender: string;
    marital_status: string;
  };
  updateFormData: (data: Partial<{
    cpf: string;
    full_name: string;
    birth_date: string;
    rg: string;
    issuing_entity: string;
    nationality: string;
    gender: string;
    marital_status: string;
  }>) => void;
  onNext: () => void;
}

type SelectProps = {
  list: { id: string; value: string }[];
};

const genderOptions: SelectProps = {
  list: [
    { id: 'male', value: 'Homem' },
    { id: 'female', value: 'Mulher' },
    { id: 'other', value: 'Outro' },
  ],
};

const civilStatusOptions: SelectProps = {
  list: [
    { id: 'single', value: 'Solteiro(a)' },
    { id: 'married', value: 'Casado(a)' },
    { id: 'separated', value: 'Separado(a)' },
    { id: 'divorced', value: 'Divorciado(a)' },
    { id: 'widowed', value: 'Viúvo(a)' },
    { id: 'common_law', value: 'União estável' },
  ],
};

export default function PersonalDataOne({ formData, updateFormData, onNext }: PersonalDataOneProps) {
  const styles = useCustomStyles();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [error, setError] = useState({
    cpf: '',
    full_name: '',
    birth_date: '',
    rg: '',
    issuing_entity: '',
    nationality: '',
    gender: '',
    marital_status: '',
  });

  const {
    mutateAsync: bureauMutation,
    isPending: loadingBureau,
  } = useMutation({
    mutationKey: ['getBureauByCpf'],
    mutationFn: getBureauByCpf,
  });

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value });
    if (error[field as keyof typeof error]) {
      setError(prev => ({ ...prev, [field]: '' }));
    }
  }

  function formatDateForDisplay(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  }

  function formatDateForAPI(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  }

  async function handleCpfChange(cpf: string) {
    handleField(cpf, 'cpf');
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      try {
        const bureauData = await bureauMutation(cleanCpf);
        if (bureauData.data) {
          updateFormData({
            full_name: bureauData.data.name,
            birth_date: formatDateForDisplay(bureauData.data.birth_date),
          });
        }
      } catch (err: any) {
        setSnackMessage('Erro ao consultar dados do CPF. Verifique se o CPF está correto.');
        setShowSnack(true);
      }
    }
  }

  function validateFields() {
    const cpfValidator = CommonValidators.isCPFValid(formData.cpf);
    const nameValidator = CommonValidators.isNameValid(formData.full_name);

    const newErrors = {
      cpf: cpfValidator.error,
      full_name: nameValidator.error,
      birth_date: !formData.birth_date ? 'Data de nascimento obrigatória' : '',
      rg: !formData.rg ? 'RG obrigatório' : '',
      issuing_entity: !formData.issuing_entity ? 'Órgão emissor obrigatório' : '',
      nationality: !formData.nationality ? 'Nacionalidade obrigatória' : '',
      gender: !formData.gender ? 'Gênero obrigatório' : '',
      marital_status: !formData.marital_status ? 'Estado civil obrigatório' : '',
    };

    setError(newErrors);
    return Object.values(newErrors).every(e => !e);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosPessoaisInicio_Continuar' });
    if (validateFields()) {
      updateFormData({ birth_date: formatDateForAPI(formData.birth_date) });
      onNext();
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosPessoaisInicio' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        {loadingBureau && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000,
          }}>
            <LoadingComp transparent />
          </View>
        )}

        <Text style={styles.title}>Dados Pessoais</Text>

        <Input
          placeholder="CPF *"
          value={formData.cpf}
          setValue={(value) => handleCpfChange(typeof value === 'string' ? value : value(formData.cpf))}
          mask="cpf"
          error={!!error.cpf}
          txtError={error.cpf}
          keyboardType="numeric"
          maxLength={14}
          editable={!loadingBureau}
        />

        <Input
          placeholder="Nome Completo *"
          value={formData.full_name}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.full_name), 'full_name')}
          error={!!error.full_name}
          txtError={error.full_name}
          autoCapitalize="words"
          editable={false}
        />

        <Input
          placeholder="Data de Nascimento *"
          value={formData.birth_date}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.birth_date), 'birth_date')}
          error={!!error.birth_date}
          txtError={error.birth_date}
          keyboardType="numeric"
          maxLength={10}
          editable={false}
        />

        <Input
          placeholder="Nacionalidade *"
          value={formData.nationality}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.nationality), 'nationality')}
          error={!!error.nationality}
          txtError={error.nationality}
          autoCapitalize="words"
        />
        <Text style={{ ...styles.subDesc, marginBottom: 8 }}>Ex.: Brasileira, Americana, etc.</Text>

        <Select
          label="Gênero *"
          placeholder="Selecione o gênero *"
          value={formData.gender || ''}
          setValue={updateFormData}
          form={formData}
          arr={genderOptions}
          fieldName="gender"
          error={!!error.gender}
          txtError={error.gender}
          marginBottom={8}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 4 }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="RG *"
              value={formData.rg}
              setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.rg), 'rg')}
              error={!!error.rg}
              txtError={error.rg}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Órgão Emissor *"
              value={formData.issuing_entity}
              setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.issuing_entity), 'issuing_entity')}
              error={!!error.issuing_entity}
              txtError={error.issuing_entity}
              autoCapitalize="characters"
            />
          </View>
        </View>
        <Text style={{ ...styles.subDesc, marginBottom: 8 }}>Ex. emissor: SSP, DETRAN, etc.</Text>

        <Select
          label="Estado Civil *"
          placeholder="Selecione o estado civil *"
          value={formData.marital_status || ''}
          setValue={updateFormData}
          form={formData}
          arr={civilStatusOptions}
          fieldName="marital_status"
          error={!!error.marital_status}
          txtError={error.marital_status}
          marginBottom={8}
        />
      </View>

      <BtnDefault
        label={loadingBureau ? "Consultando..." : "Continuar"}
        onPress={onConfirm}
        disabled={loadingBureau}
        style={{ marginBottom: 15 }}
      />

      <Snack
        visible={showSnack}
        txt={snackMessage}
        setShowSnack={setShowSnack}
        type="error"
        duration={5000}
      />
    </View>
  );
}
