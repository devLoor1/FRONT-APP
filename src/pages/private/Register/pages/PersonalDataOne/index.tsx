import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import CommonValidators from '~/helpers/validators/common.validators';
import Input from '~/components/Input';
import RadioButton from '~/components/RadioButton';
import BtnDefault from '~/components/BtnDefault';
import { CompleteRegister, GetProfessionList } from '~/services/register';
import { Text, View } from 'react-native';
import Select from '~/components/Select';
import SelectSearch from '~/components/SelectSearch';
import { useCustomStyles } from '../../style';
import { Analytics } from '~/helpers/analytics';

const scholarityList = {
  list: [
    {
      id: '1',
      value: 'Ensino Fundamental Incompleto',
    },
    {
      id: '2',
      value: 'Ensino Fundamental Completo',
    },
    {
      id: '3',
      value: 'Ensino Médio Completo',
    },
    {
      id: '4',
      value: 'Ensino Médio Incompleto',
    },
    { id: '5', value: 'Ensino Superior Completo' },
    { id: '6', value: 'Ensino Superior Incompleto' },
    { id: '7', value: 'Pós-graduação' },
  ],
};

export default function PersonalDataOne() {
  const styles = useCustomStyles();
  const dispatch = useAppDispatch();
  const { loading, professionList } = useAppSelector(state => state.register);
  const { userStatus } = useAppSelector(state => state.user);
  const [error, setError] = useState({
    profession: '',
    nationality: '',
    birthCity: '',
    isPep: '',
    scholarity: '',
  });
  const [form, setForm] = useState({
    profession: '',
    nationality: '',
    birthCity: '',
    scholarity: '',
    isPep: null,
  });

  function handleField(value: React.SetStateAction<string>, field: string) {
    setForm({ ...form, [field]: value });
  }

  async function handleSearch(filter: string) {
    await dispatch(GetProfessionList({ filter }));
  }

  function validateField(
    name: any,
    field: 'profession' | 'nationality' | 'birthCity' | 'isPep' | 'scholarity',
    txt: string
  ) {
    return userStatus?.emptyFields.includes(name)
      ? CommonValidators.isEmptyField(form[field], txt)
      : { status: true, error: '' };
  }

  async function onConfirm() {
    Analytics({ eventName: 'CadastroDadosPessoaisInicio_Continuar' });
    const professionValidator = validateField('Profession', 'profession', 'profissão');
    const nationalityValidator = validateField('Nationality', 'nationality', 'país de nascimento');
    const birthCityValidator = validateField('BirthCity', 'birthCity', 'cidade onde nasceu');
    const isPepValidator = validateField('IsPep', 'isPep', '');
    const isScholarityValidator = validateField('Scholarity', 'scholarity', '');

    setError({
      profession: professionValidator.error,
      nationality: nationalityValidator.error,
      birthCity: birthCityValidator.error,
      isPep: isPepValidator.error,
      scholarity: isScholarityValidator.error,
    });

    if (
      professionValidator.status &&
      nationalityValidator.status &&
      birthCityValidator.status &&
      isPepValidator.status &&
      isScholarityValidator.status
    ) {
      await dispatch(CompleteRegister({ ...form, isPep: form.isPep ? 1 : 0 }));
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroDadosPessoaisInicio' });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.title}>Dados Pessoais</Text>
        {userStatus?.emptyFields.includes('Profession') ? (
          <SelectSearch
            placeholder="Profissão *"
            value={form.profession}
            setValue={setForm}
            form={form}
            arr={professionList}
            fieldName="profession"
            handleSearch={handleSearch}
            error={!!error.profession}
            txtError={error.profession}
            loading={loading}
          />
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('Nationality') ? (
          <>
            <Input
              placeholder="Nacionalidade *"
              setValue={value => handleField(value, 'nationality')}
              value={form.nationality || ''}
              error={!!error.nationality}
              txtError={error.nationality}
            />
             <Text style={{ ...styles.subDesc }}>Ex.: Nacionalidade brasileira</Text>
          </>
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('BirthCity') ? (
          <>
            <Input
              placeholder="Naturalidade *"
              value={form.birthCity || ''}
              setValue={value => handleField(value, 'birthCity')}
              error={!!error.birthCity}
              txtError={error.birthCity}
            /> 
             <Text style={{ ...styles.subDesc }}>Ex.: Natural de São Paulo</Text>
          </>
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('Scholarity') ? (
          <View style={{ marginTop: 40 }}>
            <Select
              label="Escolaridade *"
              placeholder="Selecione uma opção *"
              value={form.scholarity || ''}
              setValue={setForm}
              form={form}
              arr={scholarityList}
              fieldName="scholarity"
              error={!!error.scholarity}
              txtError={error.scholarity}
            />
          </View>
        ) : (
          <></>
        )}
        {userStatus?.emptyFields.includes('IsPep') ? (
          <View style={{ marginTop: 48 }}>
            <RadioButton
              onValueChange={value => handleField(value, 'isPep')}
              value={form.isPep === null ? '' : !!form.isPep}
              legend="Você é uma pessoa politicamente exposta (PEP)? *"
              error={!!error.isPep}
              txtError={error.isPep}
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
        ) : (
          <></>
        )}
      </View>

      <BtnDefault label="Continuar" onPress={onConfirm} loading={loading} style={{ marginBottom: 15 }} />
    </View>
  );
}
