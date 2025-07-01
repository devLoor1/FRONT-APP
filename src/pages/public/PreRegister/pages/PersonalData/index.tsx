import { View, Text, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/MyThemeContext';
import Input from '@/components/Input';
import BtnDefault from '@/components/BtnDefault';
import { LeadRequest } from '@/models/lead/lead.request';
import CommonValidators from '@/helpers/validators/common.validators';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { PostLead } from '@/services/lead';
import { useAuth } from '@/context/auth';
import CommonClears from '@/helpers/clears/common.clear';
import { HelperText } from 'react-native-paper';
import { Analytics } from '@/helpers/analytics';
import { useCustomStyles } from '../../style';

type Props = {
  setGeneralInfos: React.Dispatch<React.SetStateAction<LeadRequest>>;
  generalInfos: LeadRequest;
};

export default function PersonalData({ generalInfos, setGeneralInfos }: Props) {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { deviceToken } = useAuth();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState({
    name: '',
    email: '',
    document: '',
    dateOfBirth: '',
  });
  const { hash } = useAppSelector(state => state.lead);

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosPessoais' });
  }, []);

  function handleField(value: React.SetStateAction<string>, field: string) {
    setGeneralInfos({ ...generalInfos, [field]: value });
  }

  async function onClickGeneralInfos() {
    const clearCPF = CommonClears.clearCPF(generalInfos.document || '');
    const emailValidator = CommonValidators.isEmailValid(generalInfos.email || '');
    const nameValidator = CommonValidators.isNameValid(generalInfos.name || '');
    const documentValidator = CommonValidators.isCPFValid(clearCPF);
    const birthdayValidator = month && year && day;
    setError({
      name: nameValidator.error,
      email: emailValidator.error,
      document: documentValidator.error,
      dateOfBirth: !birthdayValidator ? 'Digite uma data de aniversário válida!' : '',
    });

    if (
      emailValidator.status &&
      nameValidator.status &&
      documentValidator.status &&
      birthdayValidator &&
      hash
    ) {
      const formatedBirthday = new Date(`${year}-${month}-${day}`);

      await dispatch(
        PostLead({
          document: clearCPF,
          email: generalInfos.email,
          name: generalInfos.name,
          hash: hash.hash,
          birth: formatedBirthday,
          deviceToken,
        })
      );
    }
  }

  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <Text style={{ ...styles.title, marginBottom: 48 }}>Seus dados</Text>
        <Input
          value={generalInfos.name || ''}
          setValue={value => handleField(value, 'name')}
          placeholder="Nome Completo *"
          error={!!error.name}
          txtError={error.name}
        />
        <Text style={{ ...styles.subDesc, marginBottom: 24 }}>Ex.: Daniel, não "Dani"</Text>
        <Input
          placeholder="E-mail *"
          value={generalInfos.email?.toLocaleLowerCase() || ''}
          setValue={value => handleField(value, 'email')}
          autoComplete="email"
          keyboardType="email-address"
          error={!!error.email}
          txtError={error.email}
          marginBottom={24}
        />
        <Input
          placeholder="CPF*"
          value={generalInfos.document || ''}
          setValue={value => handleField(value, 'document')}
          error={!!error.document}
          txtError={error.document}
          keyboardType="numeric"
          mask="cpf"
          maxLength={14}
          marginBottom={24}
        />
        <Text
          style={{
            fontSize: 14,
            color: theme.customColors.desc,
            fontFamily: theme.fonts.semiBold,
            marginBottom: 6,
          }}>
          Data de nascimento *
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Dia"
              value={day ? (+day > 31 ? '31' : day) : ''}
              setValue={setDay}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Mês"
              value={month}
              setValue={e => {
                setMonth(+e > 12 ? '12' : e);
              }}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Ano"
              value={year}
              setValue={e => {
                const maxYear = new Date().getFullYear() - 17;
                const minYear = 1910;

                // Permite digitar livremente até 4 dígitos
                if (e.length < 4) {
                  setYear(e);
                  return;
                }

                const inputYear = +e;

                if (!isNaN(inputYear)) {
                  if (inputYear < minYear) {
                    setYear(minYear.toString());
                  } else if (inputYear > maxYear) {
                    setYear(maxYear.toString());
                  } else {
                    setYear(e);
                  }
                } else {
                  setYear('');
                }
              }}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>
        {error.dateOfBirth && (
          <HelperText type="error" theme={{ colors: { error: theme.customColors.error.default } }}>
            {error.dateOfBirth}
          </HelperText>
        )}

        <Text style={{ ...styles.subDesc, marginTop: 40 }}>
          Declaro para fins de comprovação de residência, sob as penas da Lei art. 1º da Lei
          7.115/83, que resido no endereço acima.
        </Text>
      </View>
      <BtnDefault
        style={{ marginBottom: Platform.OS === 'android' ? 20 : 0 }}
        label="Continuar"
        onPress={() => {
          Analytics({ eventName: 'CadastroDadosPessoais_Continuar' });
          onClickGeneralInfos();
        }}
      />
    </>
  );
}
