import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { Analytics } from '~/helpers/analytics';
import { CompleteRegister, GetAddress } from '~/services/register';
import CommonValidators from '~/helpers/validators/common.validators';
import CommonClears from '~/helpers/clears/common.clear';
import Input from '~/components/Input';
import BtnDefault from '~/components/BtnDefault';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { useAddressStyles } from './style';

export default function Address() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const addressStyles = useAddressStyles();
  const { completeAddress, loading } = useAppSelector(state => state.register);
  const [disable, setDisable] = useState({
    city: false,
    state: false,
    neighborhood: false,
    street: false,
  })
  const [form, setForm] = useState({
    city: '',
    complement: '',
    neighborhood: '',
    postalCode: '',
    state: '',
    street: '',
    streetNumber: '',
    country: 'Brasil',
  });
  const [error, setError] = useState({
    city: '',
    neighborhood: '',
    postalCode: '',
    state: '',
    street: '',
    streetNumber: '',
  });

  useEffect(() => {
    Analytics({ pageName: 'CadastroEndereco' });
  }, []);

  function handleField(value: React.SetStateAction<string>, field: string) {
    setForm({ ...form, [field]: value });
  }

  async function getAddress(cep: string) {
    await dispatch(GetAddress(cep));
  }

  useEffect(() => {
    const isCpfValid = CommonValidators.isCepValid(form.postalCode);
    if (isCpfValid.status) {
      getAddress(CommonClears.clearCEP(form.postalCode));
    }
  }, [form.postalCode]);

  useEffect(() => {
    if (completeAddress) {
      const { localidade, bairro, logradouro, uf } = completeAddress;

      setDisable({
        city: !!localidade,
        neighborhood: !!bairro,
        street: !!logradouro,
        state: !!uf
      })

      setForm({
        ...form,
        city: localidade,
        complement: '',
        neighborhood: bairro,
        street: logradouro,
        state: uf,
      });
    }
  }, [completeAddress]);

  async function onConfirm() {
    Analytics({ eventName: 'CadastroEndereco_Continuar' });
    const cepValidator = CommonValidators.isCepValid(form.postalCode);
    const cityValidator = CommonValidators.isEmptyField(form.city && !!completeAddress, 'Cidade');
    const stateValidator = CommonValidators.isEmptyField(form.state && !!completeAddress, 'Estado');
    const neighborhoodValidator = CommonValidators.isEmptyField(
      form.neighborhood && !!completeAddress,
      'Bairro'
    );
    const streetValidator = CommonValidators.isEmptyField(
      form.street && !!completeAddress,
      'Rua/Avenida'
    );
    const numberValidator = CommonValidators.isEmptyField(
      form.streetNumber && !!completeAddress,
      ''
    );

    setError({
      postalCode: cepValidator.error,
      city: cityValidator.error,
      state: stateValidator.error ? 'Obrigatório!' : '',
      neighborhood: neighborhoodValidator.error,
      street: streetValidator.error,
      streetNumber: numberValidator.error ? 'Obrigatório!' : '',
    });

    if (
      cepValidator.status &&
      cityValidator.status &&
      stateValidator.status &&
      neighborhoodValidator.status &&
      streetValidator.status &&
      numberValidator.status
    ) {
      await dispatch(
        CompleteRegister({ ...form, postalCode: CommonClears.clearCEP(form.postalCode) })
      );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        <View style={styles.content}>
        <Text style={styles.title}>Endereço</Text>
        <View>
          <Input
            label="Endereço *"
            placeholder="CEP*"
            value={form.postalCode}
            setValue={value => handleField(value, 'postalCode')}
            keyboardType="numeric"
            mask="cep"
            maxLength={9}
            error={!!error.postalCode}
            txtError={error.postalCode}
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
              value={form.city}
              setValue={value => handleField(value, 'city')}
              disabled={disable.city}
              error={!!error.city && !!completeAddress}
              txtError={error.city}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Estado"
              value={form.state}
              setValue={value => handleField(value, 'state')}
              disabled={disable.state}
              error={!!error.state && !!completeAddress}
              txtError={error.state}
            />
          </View>
        </View>
        <Input
          placeholder="Bairro *"
          value={form.neighborhood}
          setValue={value => handleField(value, 'neighborhood')}
          disabled={disable.neighborhood}
          error={!!error.neighborhood && !!completeAddress}
          txtError={error.neighborhood}
        />
        <View style={addressStyles.row}>
          <View style={{ flex: 2 }}>
            <Input
              placeholder="Rua/Avenida *"
              value={form.street}
              setValue={value => handleField(value, 'street')}
              disabled={disable.street}
              error={!!error.street && !!completeAddress}
              txtError={error.street}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Número *"
              value={form.streetNumber}
              setValue={value => handleField(value, 'streetNumber')}
              keyboardType="numeric"
              disabled={!completeAddress}
              error={!!error.streetNumber && !!completeAddress}
              txtError={error.streetNumber}
            />
          </View>
        </View>
        <Input
          placeholder="Complemento"
          value={form.complement}
          setValue={value => handleField(value, 'complement')}
          disabled={!completeAddress}
        />
        <Text style={addressStyles.warn}>
          Declaro para fins de comprovação de residência, sob as penas da Lei art. 1º da Lei
          7.115/83, que resido no endereço acima.
        </Text>
      </View>
      <BtnDefault label="Continuar" onPress={onConfirm} loading={loading} style={{ marginBottom: 15 }} />
    </View>
    </View>
  );
}
