import React, { useEffect, useState } from 'react';
import { Analytics } from '@/helpers/analytics';
import CommonValidators from '@/helpers/validators/common.validators';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
import Select from '@/components/Select';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { useAddressStyles } from './style';
import { getCepInfo, getCountries } from '@/services/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoadingComp from '@/components/Loading';
import { useTheme } from '@/context/MyThemeContext';

interface AddressProps {
  formData: {
    country_id: number;
    zip_code: string;
    city: string;
    state: string;
    district: string;
    street_name: string;
    number: string;
    complement: string;
  };
  updateFormData: (data: Partial<{
    country_id: number;
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
  const { theme } = useTheme();
  const [confirmedAddress, setConfirmedAddress] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(
    formData.country_id ? formData.country_id.toString() : ''
  );

  const [error, setError] = useState({
    country_id: '',
    zip_code: '',
    city: '',
    state: '',
    district: '',
    street_name: '',
    number: '',
    confirmed: '',
  });

  const {
    mutateAsync: cepMutation,
    isPending: loadingCep,
  } = useMutation({
    mutationKey: ['getCepInfo'],
    mutationFn: getCepInfo,
  });

  const {
    data: countriesData,
    isLoading: loadingCountries,
  } = useQuery({
    queryKey: ['getCountries'],
    queryFn: getCountries,
  });

  const countriesList = (countriesData || []).map((c: any) => ({
    id: c.id.toString(),
    value: c.name,
  }));

  const countriesArr = { list: countriesList };

  useEffect(() => {
    if (!countriesData) return;
    if (formData.country_id) {
      setSelectedCountryId(formData.country_id.toString());
    } else {
      const brazil = (countriesData as any[]).find(
        (c) => c.id === 29 || c.name?.toLowerCase().includes('brasil')
      );
      if (brazil) {
        setSelectedCountryId(brazil.id.toString());
        updateFormData({ country_id: brazil.id });
      }
    }
  }, [countriesData]);

  function handleCountryChange(option: any) {
    let idStr: string = '';
    if (typeof option === 'object' && option.selectedCountry !== undefined) {
      idStr = option.selectedCountry;
    } else if (typeof option === 'string') {
      idStr = option;
    }
    setSelectedCountryId(idStr);
    const numericId = parseInt(idStr, 10);
    updateFormData({ country_id: isNaN(numericId) ? 0 : numericId });
    if (error.country_id) setError(prev => ({ ...prev, country_id: '' }));
  }

  function handleField(value: string, field: string) {
    updateFormData({ [field]: value } as any);
    if (error[field as keyof typeof error]) {
      setError(prev => ({ ...prev, [field]: '' }));
    }
  }

  async function handleCepChange(cep: string) {
    handleField(cep, 'zip_code');
    if (cep.length < 8) {
      updateFormData({ city: '', state: '', district: '', street_name: '' });
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
      } catch {
        updateFormData({ city: '', state: '', district: '', street_name: '' });
      }
    }
  }

  function validateFields() {
    const cleanCep = formData.zip_code.replace(/\D/g, '');
    const cepValidator = CommonValidators.isCepValid(cleanCep);

    const newErrors = {
      country_id: !formData.country_id ? 'País obrigatório' : '',
      zip_code: cepValidator.error,
      city: !formData.city ? 'Cidade obrigatória' : '',
      state: !formData.state ? 'Estado obrigatório' : '',
      district: !formData.district ? 'Bairro obrigatório' : '',
      street_name: !formData.street_name ? 'Rua/Avenida obrigatória' : '',
      number: !formData.number ? 'Número obrigatório' : '',
      confirmed: !confirmedAddress ? 'Confirme o endereço para continuar' : '',
    };
    setError(newErrors);
    return Object.values(newErrors).every(e => !e);
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
      {(loadingCep || loadingCountries) && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1000,
        }}>
          <LoadingComp transparent />
        </View>
      )}

      <View style={[styles.container]}>
        <View style={styles.content}>
          <Text style={styles.title}>Endereço</Text>

          {loadingCountries ? (
            <View style={{ paddingVertical: 12 }}>
              <Text style={{ color: theme.colors.text }}>Carregando países...</Text>
            </View>
          ) : (
            <Select
              label="País *"
              placeholder="Selecione o país *"
              value={selectedCountryId}
              setValue={handleCountryChange}
              form={{ selectedCountry: selectedCountryId }}
              arr={countriesArr}
              fieldName="selectedCountry"
              withSearch
              error={!!error.country_id}
              txtError={error.country_id}
              marginBottom={8}
            />
          )}

          <View>
            <Input
              label="Endereço *"
              placeholder="CEP *"
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

          {/* Confirm address checkbox */}
          <TouchableOpacity
            onPress={() => {
              setConfirmedAddress(prev => !prev);
              if (error.confirmed) setError(prev => ({ ...prev, confirmed: '' }));
            }}
            style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 16, gap: 10 }}
          >
            <View style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: error.confirmed
                ? theme.colors.notification
                : confirmedAddress
                  ? theme.customColors.secondary[500]
                  : theme.customColors.neutrals[400],
              backgroundColor: confirmedAddress ? theme.customColors.secondary[500] : 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 2,
              flexShrink: 0,
            }}>
              {confirmedAddress && (
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 18 }}>✓</Text>
              )}
            </View>
            <Text style={{
              flex: 1,
              color: error.confirmed
                ? theme.colors.notification
                : theme.dark ? theme.customColors.neutrals[300] : theme.customColors.neutrals[600],
              fontSize: 13,
              fontFamily: theme.fonts.semiBold,
              lineHeight: 20,
            }}>
              Confirmo que esse é meu endereço residencial e as informações estão corretas.
            </Text>
          </TouchableOpacity>
          {!!error.confirmed && (
            <Text style={{ color: theme.colors.notification, fontSize: 12, marginTop: 4, marginLeft: 32 }}>
              {error.confirmed}
            </Text>
          )}
        </View>

        <BtnDefault
          label={loadingCep ? "Consultando CEP..." : "Continuar"}
          onPress={onConfirm}
          disabled={loadingCep}
          style={{ marginBottom: 15 }}
        />
      </View>
    </View>
  );
}
