import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Steps from '@/components/Steps';
import PersonalDataOne from './pages/PersonalDataOne';
import { useCustomStyles } from './style';
import Snack from '@/components/Snack';
import PersonalDataTwo from './pages/PersonalDataTwo';
import Address from './pages/Address';
import Proof from './pages/Proof'; 
import SuccessPage from './pages/Success';
import { useTheme } from '@/context/MyThemeContext';
import BankData from './pages/BankData';
import { postPersonalInformation } from '@/services/user';
import { useMutation } from '@tanstack/react-query';
import { getRegistrationInitialPage } from '@/features/investor-access/investorAccess';

interface RegisterFormData {
  cpf: string;
  full_name: string;
  birth_date: string;
  rg: string;
  issuing_entity: string;
  nationality: string;
  
  gender: string;
  marital_status: string;
  job: string;
  role: string;
  annual_income: number;
  exposed_politically: number;
  
  zip_code: string;
  city: string;
  state: string;
  district: string;
  street_name: string;
  number: string;
  complement: string;
  
  bank_id: number;
  agency: string;
  account: string;
  account_digit: string;
}

export default function RegisterPage() {
  const styles = useCustomStyles();
  const { user } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(() => getRegistrationInitialPage(user));
  const [showSnack, setShowSnack] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  const [formData, setFormData] = useState<RegisterFormData>({
    cpf: '',
    full_name: '',
    birth_date: '',
    rg: '',
    issuing_entity: '',
    nationality: '',
    gender: '',
    marital_status: '',
    job: '',
    role: '',
    annual_income: 0,
    exposed_politically: 0,
    zip_code: '',
    city: '',
    state: '',
    district: '',
    street_name: '',
    number: '',
    complement: '',
    bank_id: 0,
    agency: '',
    account: '',
    account_digit: '',
  });

  const {
    mutateAsync: submitPersonalInformation,
    isPending: loadingSubmit,
  } = useMutation({
    mutationKey: ['postPersonalInformation'],
    mutationFn: postPersonalInformation,
  });

  const updateFormData = (newData: Partial<RegisterFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextPage = () => {
    const nextPageIndex = page + 1;
    
    if (nextPageIndex >= 6) {
      submitForm();
    } else {
      setPage(nextPageIndex);
    }
  };

  const handleBankDataNext = async () => {
    setIsSubmitting(true);
    try {
      const submitted = await submitForm();
      if (submitted) setPage(4);
    } catch (error: any) {
      if (error.response?.status === 403 && 
          error.response?.data?.message === "Informações pessoais já cadastradas") {
        setPage(4); // Proof
        return;
      }
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
        setMsgError(`Erro na validação: ${errorMessages}`);
      } else {
        setMsgError('Erro ao enviar dados. Tente novamente.');
      }
      setShowSnack(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };

  const submitForm = async (): Promise<boolean> => {
    const requiredFields = {
      full_name: formData.full_name,
      cpf: formData.cpf,
      birth_date: formData.birth_date,
      rg: formData.rg,
      issuing_entity: formData.issuing_entity,
      nationality: formData.nationality,
      gender: formData.gender,
      marital_status: formData.marital_status,
      job: formData.job,
      role: formData.role,
      annual_income: formData.annual_income,
      zip_code: formData.zip_code,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      street_name: formData.street_name,
      number: formData.number,
      bank_id: formData.bank_id,
      agency: formData.agency,
      account: formData.account,
      account_digit: formData.account_digit,
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value === 0)
      .map(([key]) => key);

    if (!user?.phone) {
      setMsgError('Telefone do usuário não encontrado. Faça login novamente.');
      setShowSnack(true);
      return false;
    }

    if (emptyFields.length > 0) {
      setMsgError(`Campos obrigatórios não preenchidos: ${emptyFields.join(', ')}`);
      setShowSnack(true);
      return false;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        phone: user?.phone || "",
        investor_personal_information: {
          nationality: formData.nationality.toLowerCase() === 'brasileiro' || formData.nationality.toLowerCase() === 'brasileira' ? 'brazilian' : formData.nationality,
          gender: formData.gender,
          cpf: formData.cpf,
          birth_date: formData.birth_date,
          rg: formData.rg,
          issuing_entity: formData.issuing_entity,
          marital_status: formData.marital_status,
          company: "",
          job: formData.job,
          role: formData.role,
          annual_income: formData.annual_income,
          exposed_politically: formData.exposed_politically
        },
        address: {
          country_id: 29,
          zip_code: formData.zip_code.replace(/\D/g, ''),
          street_name: formData.street_name,
          number: formData.number,
          district: formData.district,
          city: formData.city,
          state: formData.state,
          complement: formData.complement || null
        },
        investor_company_information: {
          name: "",
          fantasy_name: "",
          cnpj: "",
          type: ""
        },
        bank_account: {
          bank_id: formData.bank_id,
          agency: formData.agency,
          account: formData.account,
          account_digit: formData.account_digit
        }
      };

      await submitPersonalInformation(payload);
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  function renderContent() {
    switch (page) {
      case 1:
        return <PersonalDataTwo formData={formData} updateFormData={updateFormData} onNext={nextPage} onPrev={prevPage} />;
      case 2:
        return <Address formData={formData} updateFormData={updateFormData} onNext={nextPage} onPrev={prevPage} />;
      case 3:
        return <BankData formData={formData} updateFormData={updateFormData} onNext={handleBankDataNext} onPrev={prevPage} isSubmitting={isSubmitting} />;
      case 4:
        return <Proof onContinue={() => setPage(5)} />;
      case 5:
        return <SuccessPage />;
      default:
        return <PersonalDataOne formData={formData} updateFormData={updateFormData} onNext={nextPage} />;
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ paddingHorizontal: 16 }}>
          {page !== 5 && <Steps qtd={4} index={page + 1} />}
        </View>
        
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[
              styles.container, styles.containerForm
            ]}
          >
            {renderContent()}
          </View>
        </ScrollView>
        <Snack visible={showSnack} txt={msgError} setShowSnack={setShowSnack} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
