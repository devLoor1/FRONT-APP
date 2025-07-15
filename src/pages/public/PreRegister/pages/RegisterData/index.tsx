import { View, Text, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
import CommonValidators from '@/helpers/validators/common.validators';
import { Analytics } from '@/helpers/analytics';
import { useCustomStyles } from '../../style';
import { RegisterRequest } from '@/models/auth/register.request';
import Select from '@/components/Select';

type Props = {
  readonly setRegisterPayload: React.Dispatch<React.SetStateAction<RegisterRequest>>;
  readonly registerPayload: RegisterRequest;
  readonly onPress: (data: RegisterRequest) => void;
};

const type = {
  list: [
    {
      id: 'pessoa_fisica',
      value: 'Pessoa Física',
    },
    {
      id: 'pessoa_juridica',
      value: 'Pessoa Jurídica',
    },
  ],
};

export default function RegisterData({ setRegisterPayload, registerPayload, onPress }: Props) {
  const styles = useCustomStyles();
  const [error, setError] = useState({
    email: '',
    full_name: '',
    phone: '',
    type: '',
  });

  useEffect(() => {
    Analytics({ pageName: 'Cadastro' });
  }, []);

  function handleField(value: React.SetStateAction<string>, field: string) {
    setRegisterPayload({ ...registerPayload, [field]: value });
  }

  async function onClickRegisterData() {
    const emailValidator = CommonValidators.isEmailValid(registerPayload.email || '');
    const fullNameValidator = CommonValidators.isNameValid(registerPayload.full_name || '');
    const phoneValidator = CommonValidators.isCellphoneValid(registerPayload.phone || '');
    const typeValidator = registerPayload.type;

    setError({
      email: emailValidator.error,
      full_name: fullNameValidator.error,
      phone: phoneValidator.error,
      type: !typeValidator ? 'Selecione o tipo de pessoa' : '',
    });

    if (
      emailValidator.status &&
      fullNameValidator.status &&
      phoneValidator.status &&
      typeValidator
    ) {
      onPress(registerPayload);
    }
  }

  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <Text style={{ ...styles.title, marginBottom: 48 }}>Seus dados</Text>
        <Input
          value={registerPayload.full_name || ''}
          setValue={value => handleField(value, 'full_name')}
          placeholder="Nome Completo *"
          error={!!error.full_name}
          txtError={error.full_name}
        />
        <Text style={{ ...styles.subDesc, marginBottom: 24 }}>Ex.: Daniel, não "Dani"</Text>
        <Input
          placeholder="E-mail *"
          value={registerPayload.email?.toLocaleLowerCase() || ''}
          setValue={value => handleField(value, 'email')}
          autoComplete="email"
          keyboardType="email-address"
          error={!!error.email}
          txtError={error.email}
          marginBottom={24}
        />
        <View style={styles.rowInputs}>
          <View style={{ maxWidth: 60 }}>
            <Input
              setValue={() => null}
              placeholder="+55"
              value="+55"
              keyboardType="number-pad"
              editable={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              setValue={value => handleField(value, 'phone')}
              placeholder="Telefone celular *"
              value={registerPayload.phone || ''}
              keyboardType="number-pad"
              autoComplete="tel"
              mask="phone"
              maxLength={15}
              error={!!error.phone}
              txtError={error.phone}
            />
          </View>
        </View>
        <Select
          placeholder="Tipo de pessoa"
          required={true}
          value={registerPayload.type || ''}
          setValue={setRegisterPayload}
          form={registerPayload}
          arr={type}
          fieldName="type"
          error={!!error.type}
          txtError={'Necessário selecionar o tipo de pessoa'}
        />

      </View>
      <BtnDefault
        style={{ marginBottom: Platform.OS === 'android' ? 20 : 0 }}
        label="Continuar"
        onPress={() => {
          Analytics({ eventName: 'Cadastro_Continuar' });
          onClickRegisterData();
        }}
      />
    </>
  );
}
