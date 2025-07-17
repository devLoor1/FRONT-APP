import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CommonValidators from '@/helpers/validators/common.validators';
// import { CompleteRegister } from '@/services/register';
import Select from '@/components/Select';
import Input from '@/components/Input';
import RadioButton from '@/components/RadioButton';
import BtnDefault from '@/components/BtnDefault';
import { Text, View } from 'react-native';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';

type SelectProps = {
  list: {
    id: string;
    value: string;
  }[];
};

const gender: SelectProps = {
  list: [
    {
      id: '1',
      value: 'Eu me identifico Homem',
    },
    {
      id: '2',
      value: 'Eu me identifico Mulher',
    },
    {
      id: '3',
      value: 'Eu me identifico Homem Trans',
    },
    {
      id: '4',
      value: 'Eu me identifico Mulher Trans',
    },
    {
      id: '5',
      value: 'Eu me identifico Agênero',
    },
    {
      id: '6',
      value: 'Eu me identifico Não binário',
    },
    {
      id: '7',
      value: 'Eu me identifico Travesti',
    },
    {
      id: '8',
      value: 'Eu me identifico Queer',
    },
    {
      id: '9',
      value: 'Outro',
    },
  ],
};

const civilStatus: SelectProps = {
  list: [
    {
      id: '1',
      value: 'Solteiro',
    },
    {
      id: '2',
      value: 'Casado',
    },
    {
      id: '3',
      value: 'Separado',
    },
    {
      id: '4',
      value: 'Divorciado',
    },
    {
      id: '5',
      value: 'Viúvo',
    },
    {
      id: '6',
      value: 'União estável',
    },
  ],
};

export default function PersonalDataTwo() {
  const styles = useCustomStyles();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.register);
  const [error, setError] = useState({
    gender: '',
    maritalStatus: '',
    spouse: '',
    hasOwnResidence: '',
  });
  const [form, setForm] = useState({
    gender: '',
    maritalStatus: '',
    spouse: '',
    hasOwnResidence: null,
  });
  const { userStatus } = useAppSelector(state => state.user);

  function handleField(value: React.SetStateAction<string>, field: string) {
    setForm({ ...form, [field]: value });
  }

  useEffect(() => {
    if (form.maritalStatus !== 'Casado' && form.maritalStatus !== 'União estável') {
      setForm({ ...form, spouse: '' });
    }
  }, [form.maritalStatus]);

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosPessoaisInfos' });
  }, []);

  function validateField(
    name: any,
    field: 'gender' | 'maritalStatus' | 'hasOwnResidence' | 'spouse',
    txt: string
  ) {
    return userStatus?.emptyFields.includes(name)
      ? CommonValidators.isEmptyField(form[field], txt)
      : { status: true, error: '' };
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosPessoaisInfos_Continuar' });
    const genderValidator = validateField('Gender', 'gender', 'gênero');
    const maritalStatusValidator = validateField('MaritalStatus', 'maritalStatus', 'estado civil');
    const spouseValidator = CommonValidators.isEmptyField(form.spouse, 'nome do cônjuge');

    const hasOwnResidenceValidator = validateField('HasOwnResidence', 'hasOwnResidence', '');

    setError({
      gender: genderValidator.error,
      maritalStatus: maritalStatusValidator.error,
      spouse: spouseValidator.error,
      hasOwnResidence: hasOwnResidenceValidator.error,
    });

    if (form.maritalStatus !== 'Casado' && form.maritalStatus !== 'União estável') {
      spouseValidator.status = true;
      spouseValidator.error = '';
    }

    if (
      genderValidator.status &&
      maritalStatusValidator.status &&
      hasOwnResidenceValidator.status &&
      spouseValidator.status
    ) {
      // await dispatch(
      //   CompleteRegister({
      //     ...form,
      //     hasOwnResidence: form.hasOwnResidence ? 1 : 0,
      //   })
      // );
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.title}>Dados Pessoais</Text>
        {userStatus?.emptyFields.includes('Gender') ? (
          <Select
            label="Qual o seu gênero *"
            placeholder="Selecione uma opção *"
            value={form.gender || ''}
            setValue={setForm}
            form={form}
            arr={gender}
            fieldName="gender"
            error={!!error.gender}
            txtError={error.gender}
            marginBottom={48}
          />
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('MaritalStatus') ? (
          <Select
            label="Estado Civil*"
            placeholder="Selecione uma opção *"
            value={form.maritalStatus || ''}
            setValue={setForm}
            form={form}
            arr={civilStatus}
            fieldName="maritalStatus"
            error={!!error.maritalStatus}
            txtError={error.maritalStatus}
          />
        ) : (
          <></>
        )}
        {(form.maritalStatus === 'Casado' || form.maritalStatus === 'União estável') &&
          userStatus?.emptyFields.includes('MaritalStatus') ? (
          <Input
            placeholder="Nome completo do cônjuge*"
            value={form.spouse || ''}
            setValue={value => handleField(value, 'spouse')}
            error={!!error.spouse}
            txtError={error.spouse}
          />
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('HasOwnResidence') ? (
          <View style={{ marginTop: 48 }}>
            <RadioButton
              onValueChange={value => handleField(value, 'hasOwnResidence')}
              value={form.hasOwnResidence === null ? '' : !!form.hasOwnResidence}
              legend="Possui casa própria?*"
              error={!!error.hasOwnResidence}
              txtError={error.hasOwnResidence}
              row
              data={[
                {
                  boldLabel: 'Sim',
                  label: '',
                  value: true,
                },
                {
                  boldLabel: 'Não',
                  label: '',
                  value: false,
                },
              ]}
            />
          </View>
        ) : (
          <></>
        )}
      </View>
      <BtnDefault label="Continuar" onPress={onConfirm} loading={loading} style={{ marginBottom: 15 }} />
    </View>
  );
}
