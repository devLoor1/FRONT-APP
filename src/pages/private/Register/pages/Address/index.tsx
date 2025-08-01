import React, { useEffect, useState } from 'react';
import { Analytics } from '@/helpers/analytics';
import CommonValidators from '@/helpers/validators/common.validators';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { useAddressStyles } from './style';
import { getCepInfo } from '@/services/common';
import { useMutation } from '@tanstack/react-query';
import LoadingComp from '@/components/Loading';

interface AddressProps {
  formData: {
    zip_code: string;
    city: string;
    state: string;
    district: string;
    street_name: string;
    number: string;
    complement: string;
  };
  updateFormData: (data: Partial<{
    zip_code: string;
    city: string;
    state: string;
    district: string;
    street_name: string;
    number: string;
    complement: string;
  }>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Address({ formData, updateFormData, onNext, onPrev }: AddressProps) {
  const styles = useCustomStyles();
  const addressStyles = useAddressStyles();
  
  const [error, setError] = useState({
    zip_code: '',
    city: '',
    state: '',
    district: '',
    street_name: '',
    number: '',
  });

  const {
    mutateAsync: cepMutation,
    isPending: loadingCep,
  } = useMutation({
    mutationKey: ['getCepInfo'],
    mutationFn: getCepInfo,
  });

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value });
    
    if (error[field as keyof typeof error]) {
      setError({ ...error, [field]: '' });
    }
  }

  async function handleCepChange(cep: string) {
    handleField(cep, 'zip_code');
    
    if (cep.length < 8) {
      updateFormData({
        city: '',
        state: '',
        district: '',
        street_name: '',
      });
      return;
    }
    
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      try {
        const cepData = await cepMutation(cleanCep);
        
        if (cepData.data) {
          updateFormData({
            city: cepData.data.city || '',
            state: cepData.data.state || '',
            district: cepData.data.district || '',
            street_name: cepData.data.street_name || '',
          });
        }
      } catch (error: any) {
        updateFormData({
          city: '',
          state: '',
          district: '',
          street_name: '',
        });
      }
    }
  }

  function validateFields() {
    const cleanCep = formData.zip_code.replace(/\D/g, '');
    const cepValidator = CommonValidators.isCepValid(cleanCep);
    
    const newErrors = {
      zip_code: cepValidator.error,
      city: !formData.city ? 'Cidade obrigatória' : '',
      state: !formData.state ? 'Estado obrigatório' : '',
      district: !formData.district ? 'Bairro obrigatório' : '',
      street_name: !formData.street_name ? 'Rua/Avenida obrigatória' : '',
      number: !formData.number ? 'Número obrigatório' : '',
    };

    setError(newErrors);
    return Object.values(newErrors).every(error => !error);
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroEndereco_Continuar' });
    
    if (validateFields()) {
      onNext();
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroEndereco' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loadingCep && (
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
      
      <View style={[styles.container]}>
        <View style={styles.content}>
          <Text style={styles.title}>Endereço</Text>
          
          <View>
            <Input
              label="Endereço *"
              placeholder="CEP*"
              value={formData.zip_code}
              setValue={(value) => handleCepChange(typeof value === 'string' ? value : value(formData.zip_code))}
              keyboardType="numeric"
              mask="cep"
              maxLength={9}
              error={!!error.zip_code}
              txtError={error.zip_code}
              editable={!loadingCep}
            />
            <TouchableOpacity
              style={addressStyles.searchCepBlock}
              onPress={() => {
                Analytics({ eventName: 'CadastroEndereco_PesquisaCEP' });
                Linking.openURL('https://buscacepinter.correios.com.br/app/endereco/index.php');
              }}>
              <Text style={addressStyles.searchTxt}>Não sei meu CEP</Text>
            </TouchableOpacity>
          </View>
          
          <View style={addressStyles.row}>
            <View style={{ flex: 2 }}>
              <Input
                placeholder="Cidade"
                value={formData.city}
                setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.city), 'city')}
                error={!!error.city}
                txtError={error.city}
                editable={!loadingCep}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Estado"
                value={formData.state}
                setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.state), 'state')}
                error={!!error.state}
                txtError={error.state}
                editable={!loadingCep}
              />
            </View>
          </View>
          
          <Input
            placeholder="Bairro *"
            value={formData.district}
            setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.district), 'district')}
            error={!!error.district}
            txtError={error.district}
            editable={!loadingCep}
          />
          
          <View style={addressStyles.row}>
            <View style={{ flex: 2 }}>
              <Input
                placeholder="Rua/Avenida *"
                value={formData.street_name}
                setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.street_name), 'street_name')}
                error={!!error.street_name}
                txtError={error.street_name}
                editable={!loadingCep}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="Número *"
                value={formData.number}
                setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.number), 'number')}
                keyboardType="numeric"
                error={!!error.number}
                txtError={error.number}
              />
            </View>
          </View>
          
          <Input
            placeholder="Complemento"
            value={formData.complement}
            setValue={(value) => handleField(typeof value === 'string' ? value : value(formData.complement), 'complement')}
          />
          
          <Text style={addressStyles.warn}>
            Declaro para fins de comprovação de residência, sob as penas da Lei art. 1º da Lei
            7.115/83, que resido no endereço acima.
          </Text>
        </View>
        
        <BtnDefault 
          label={loadingCep ? "Consultando..." : "Continuar"} 
          onPress={onConfirm} 
          disabled={loadingCep}
          style={{ marginBottom: 15 }} 
        />
      </View>
    </View>
  );
}
