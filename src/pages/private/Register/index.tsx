import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Steps from '@/components/Steps';
import PersonalDataOne from './pages/PersonalDataOne';
import { useCustomStyles } from './style';
import Snack from '@/components/Snack';
import Address from './pages/Address';
import { useTheme } from '@/context/MyThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/models/routes/navigation.private';
import { postPersonalInformation } from '@/services/user';
import { fetchUserData } from '@/redux/reducers/auth';
import { useMutation } from '@tanstack/react-query';

interface QuickProfileFormData {
  cpf: string;
  full_name: string;
  birth_date: string;
  phone: string;

  country_id: number;
  zip_code: string;
  city: string;
  state: string;
  district: string;
  street_name: string;
  number: string;
  complement: string;
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { user } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState('');
  const { theme } = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<QuickProfileFormData>({
    cpf: '',
    full_name: '',
    birth_date: '',
    phone: user?.phone || '',
    country_id: 29,
    zip_code: '',
    city: '',
    state: '',
    district: '',
    street_name: '',
    number: '',
    complement: '',
  });

  const {
    mutateAsync: submitPersonalInformation,
    isPending: isSubmitting,
  } = useMutation({
    mutationKey: ['postPersonalInformation'],
    mutationFn: postPersonalInformation,
  });

  const updateFormData = (newData: Partial<QuickProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(0, prev - 1));

  async function handleAddressNext() {
    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');

      const payload = {
        full_name: formData.full_name,
        phone: cleanPhone,
        investor_personal_information: {
          nationality: 'brazilian',
          gender: 'male',
          cpf: formData.cpf.replace(/\D/g, ''),
          birth_date: formData.birth_date,
          rg: '',
          issuing_entity: '',
          marital_status: 'single',
          company: '',
          job: 'Não informado',
          role: '',
          annual_income: 0,
          exposed_politically: false,
        },
        address: {
          country_id: formData.country_id || 29,
          zip_code: formData.zip_code.replace(/\D/g, ''),
          street_name: formData.street_name,
          number: formData.number,
          district: formData.district,
          city: formData.city,
          state: formData.state,
          complement: formData.complement || '',
        },
        investor_company_information: {
          name: '',
          fantasy_name: '',
          cnpj: '',
          type: '',
        },
        bank_account: {
          bank_id: null,
          agency: '',
          account: '',
          account_digit: '',
        },
      };

      await submitPersonalInformation(payload);

      await dispatch(fetchUserData());

      nav.replace('FaceMatch');
    } catch (error: any) {
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.message === 'Informações pessoais já cadastradas'
      ) {
        await dispatch(fetchUserData());
        nav.replace('FaceMatch');
        return;
      }

      const serverMsg = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;

      if (validationErrors?.length) {
        setMsgError(validationErrors.map((e: any) => e.message).join(', '));
      } else {
        setMsgError(serverMsg || 'Erro ao salvar dados. Tente novamente.');
      }
      setShowSnack(true);
    }
  }

  function renderContent() {
    if (page === 1) {
      return (
        <Address
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleAddressNext}
          onPrev={prevPage}
          isSubmitting={isSubmitting}
        />
      );
    }
    return (
      <PersonalDataOne
        formData={formData}
        updateFormData={updateFormData}
        onNext={nextPage}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ paddingHorizontal: 16 }}>
          <Steps qtd={2} index={page + 1} />
        </View>

        <ScrollView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View style={[styles.container, styles.containerForm]}>
            {renderContent()}
          </View>
        </ScrollView>

        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
