import React, { useEffect, useState } from 'react';
import CommonValidators from '@/helpers/validators/common.validators';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
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
    phone: string;
  };
  updateFormData: (data: Partial<{
    cpf: string;
    full_name: string;
    birth_date: string;
    phone: string;
  }>) => void;
  onNext: () => void;
}

export default function PersonalDataOne({ formData, updateFormData, onNext }: PersonalDataOneProps) {
  const styles = useCustomStyles();
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const [error, setError] = useState({
    cpf: '',
    full_name: '',
    birth_date: '',
    phone: '',
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
            full_name: bureauData.data.name || '',
            birth_date: formatDateForDisplay(bureauData.data.birth_date || ''),
          });
        }
      } catch {
        setSnackMessage('Não foi possível consultar dados do CPF. Preencha manualmente.');
        setShowSnack(true);
      }
    }
  }

  function validateFields() {
    const cpfValidator = CommonValidators.isCPFValid(formData.cpf);
    const nameValidator = CommonValidators.isNameValid(formData.full_name);
    const cleanPhone = formData.phone.replace(/\D/g, '');

    const newErrors = {
      cpf: cpfValidator.error,
      full_name: nameValidator.error,
      birth_date: !formData.birth_date ? 'Data de nascimento obrigatória' : '',
      phone: cleanPhone.length < 10 ? 'Telefone inválido' : '',
    };

    setError(newErrors);
    return Object.values(newErrors).every(e => !e);
  }

  async function onConfirm() {
    Analytics({ eventName: 'QuickProfile_DadosPessoais_Continuar' });
    if (validateFields()) {
      updateFormData({ birth_date: formatDateForAPI(formData.birth_date) });
      onNext();
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'QuickProfile_DadosPessoais' });
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
        />

        <Input
          placeholder="Data de Nascimento *"
          value={formData.birth_date}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.birth_date), 'birth_date')}
          error={!!error.birth_date}
          txtError={error.birth_date}
          keyboardType="numeric"
          maxLength={10}
          mask="date"
        />

        <Input
          placeholder="Telefone *"
          value={formData.phone}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.phone), 'phone')}
          error={!!error.phone}
          txtError={error.phone}
          keyboardType="phone-pad"
          mask="phone"
          maxLength={15}
        />
      </View>

      <BtnDefault
        label={loadingBureau ? 'Consultando...' : 'Continuar'}
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
