import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { CompleteRegister, GetBanks } from '@/services/register';
import { GetUserStatus } from '@/services/user';
import { useAuth } from '@/context/auth';
import { useCustomStyles } from '../../style';
import Input from '@/components/Input';
import Select from '@/components/Select';
import BtnDefault from '@/components/BtnDefault';
import Snack from '@/components/Snack';

export default function BankData() {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { deviceToken } = useAuth();
  const { listBanks } = useAppSelector(state => state.register);
  // const { changeBankStatus, requestError, loading } = useAppSelector(state => state.bank);

  const [form, setForm] = useState({
    fullBank: '',
    agency: '',
    accountNumber: '',
    accountDigit: '',
    accountType: '',
    bank: '',
    bankNumber: '',
  });

  const [banks, setBanks] = useState<{ id: string; value: string }[]>([]);
  const accountTypesArr = [
    { id: '1', value: 'Conta-Corrente' },
    { id: '2', value: 'Conta-Pagamento' },
  ];
  const [showSnack, setShowSnack] = useState(false);
  const [msgSnack, setMsgSnack] = useState('');
  const [snackType, setSnackType] = useState<'error' | 'warning' | 'information'>('error');

  const updateFormField = (fieldName: string, value: string | React.SetStateAction<string>) => {
    setForm(prev => ({
      ...prev,
      [fieldName]: typeof value === 'function' ? value(prev[fieldName as keyof typeof prev] as string) : value,
    }));
  };

  const handleNumericInput = (fieldName: string) => (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    updateFormField(fieldName, numericValue);
  };

  useEffect(() => {
    // dispatch(GetBanks());
  }, []);

  useEffect(() => {
    if (listBanks) {
      const newBanks = listBanks.map(el => ({
        id: el.number,
        value: `${el.number} - ${el.name}`,
      }));
      setBanks(newBanks);
    }
  }, [listBanks]);

  useEffect(() => {
    if (form.fullBank) {
      const separateBank = form.fullBank.split(' - ');
      setForm(prev => ({
        ...prev,
        bank: separateBank[1] || '',
        bankNumber: separateBank[0] || '',
      }));
    }
  }, [form.fullBank]);

  async function onConfirmBank() {
    const payload = {
      accountDigit: form.accountDigit,
      accountNumber: form.accountNumber,
      accountType: form.accountType,
      agency: form.agency,
      bank: form.bank,
      bankNumber: form.bankNumber,
    };
    
    // await dispatch(CompleteRegister(payload));
    // await dispatch(GetUserStatus(deviceToken));
  }

  // useEffect(() => {
  //   if (changeBankStatus) {
  //     setSnackType('information');
  //     setMsgSnack('Conta cadastrada com sucesso!');
  //     setShowSnack(true);
  //   }
  // }, [changeBankStatus]);

  // useEffect(() => {
  //   if (requestError) {
  //     setSnackType('error');
  //     setMsgSnack(requestError);
  //     setShowSnack(true);
  //   }
  // }, [requestError]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Dados bancários</Text>
          <Select
            label="Banco"
            required={true}
            value={form.fullBank}
            setValue={setForm}
            form={form}
            arr={{ list: banks }}
            fieldName="fullBank"
            withSearch={true}
            marginBottom={16}
          />
          <Input
            value={form.agency}
            label="Agência sem o dígito"
            required={true}
            setValue={(value) => updateFormField('agency', value)}
            onChangeText={handleNumericInput('agency')}
            keyboardType="numeric"
            maxLength={4}
            marginBottom={16}
          />
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 3 }}>
              <Input
                label="Conta"
                required={true}
                value={form.accountNumber}
                setValue={(value) => updateFormField('accountNumber', value)}
                onChangeText={handleNumericInput('accountNumber')}
                keyboardType="numeric"
                maxLength={11}
                marginBottom={16}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Dígito"
                required={true}
                value={form.accountDigit}
                setValue={(value) => updateFormField('accountDigit', value)}
                onChangeText={handleNumericInput('accountDigit')}
                keyboardType="numeric"
                maxLength={1}
                marginBottom={16}
              />
            </View>
          </View>
          <Select
            label="Tipo de conta"
            required={true}
            value={form.accountType}
            setValue={setForm}
            form={form}
            fieldName="accountType"
            arr={{ list: accountTypesArr }}
          />
        </View>
        {/* <BtnDefault label="Continuar" onPress={onConfirmBank} loading={loading} style={{ marginBottom: 15 }} /> */}
      </View>
      {/* <Snack visible={showSnack} txt={msgSnack} setShowSnack={setShowSnack} type={snackType} /> */}
    </View>
  );
} 