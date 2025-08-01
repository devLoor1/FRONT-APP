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
    rg: string;
    issuing_entity: string;
    nationality: string;
  };
  updateFormData: (data: Partial<{
    cpf: string;
    full_name: string;
    birth_date: string;
    rg: string;
    issuing_entity: string;
    nationality: string;
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
    rg: '',
    issuing_entity: '',
    nationality: '',
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
      setError({ ...error, [field]: '' });
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
      } catch (error: any) {
        console.error('Erro ao consultar bureau:', error);
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
    };

    setError(newErrors);

    return Object.values(newErrors).every(error => !error);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosPessoaisInicio_Continuar' });
    
    if (validateFields()) {
      // Converter data para formato da API antes de salvar no estado global
      const formDataForAPI = {
        ...formData,
        birth_date: formatDateForAPI(formData.birth_date),
      };
      
      // Atualizar o estado global com a data no formato correto
      updateFormData({ birth_date: formDataForAPI.birth_date });
      
      onNext(); // Navegar para o próximo step
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}>
            <LoadingComp transparent />
          </View>
        )}
        <Text style={styles.title}>Dados Pessoais</Text>
        
        <View style={{ position: 'relative' }}>
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
        </View>

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

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
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

          <View>
            <Input
              placeholder="Órgão Emissor *"
              value={formData.issuing_entity}
              setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.issuing_entity), 'issuing_entity')}
              error={!!error.issuing_entity}
              txtError={error.issuing_entity}
              autoCapitalize="characters"
            />
            <Text style={{ ...styles.subDesc }}>Ex.: SSP, DETRAN, etc.</Text>
          </View>
        </View>

        <Input
          placeholder="Nacionalidade *"
          value={formData.nationality}
          setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.nationality), 'nationality')}
          error={!!error.nationality}
          txtError={error.nationality}
          autoCapitalize="words"
        />
        <Text style={{ ...styles.subDesc }}>Ex.: Brasileira, Americana, etc.</Text>
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
