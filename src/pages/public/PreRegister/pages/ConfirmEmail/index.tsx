import { View, Text, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '~/context/MyThemeContext';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import CommonMask from '~/helpers/masks';
import { GetIdentifierLead, SendIdentifierEmail } from '~/services/lead';
import { Analytics } from '~/helpers/analytics';
import { useCustomStyles } from '../../style';
import CountdownTimer from '~/components/CountdownTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  email: string;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  setMsgType: React.Dispatch<React.SetStateAction<'error' | 'warning' | 'information'>>;
};

const CELL_COUNT = 6;
export default function ConfirmEmail({ email, setShowSnack, setAlertMsg, setMsgType }: Props) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [canResend, setCanResend] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const { identifierLeadData, loadingConfirm, hash } = useAppSelector(state => state.lead);

  async function onSubmitConfirmEmail() {
    if (value.length < 6) { return }

    try {
      const transaction = identifierLeadData?.transaction;
      if (transaction) {

        await AsyncStorage.setItem('userEmailLogin', email); 

        await dispatch(
          SendIdentifierEmail({
            transaction,
            code: value,
          })
        );
      }
    } catch {
      setAlertMsg('Código inválido!');
      setShowSnack(true);
    }
  }

  async function getIdentifier() {
    if (hash && hash.hash) {
      await dispatch(
        GetIdentifierLead({
          hash: hash.hash,
          reason: 'ConfirmEmail',
        })
      );
    }
  }

  useEffect(() => {
    Analytics({ pageName: 'CadastroTokenEmail' });
    getIdentifier();
  }, []);

  useEffect(() => {
    if (value.length < 6) { return }

    Analytics({ eventName: 'CadastroTokenEmail_Continuar' });
    onSubmitConfirmEmail();
  }, [value]);

  return (
    <>
      {loadingConfirm && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View style={{ flexGrow: 1 }}>
        <Text style={styles.title}>Código 6 dígitos</Text>
        <Text style={styles.desc}>
          Código enviado para{' '}
          <Text style={{ fontFamily: theme.fonts.bold }}>
            {CommonMask.email(email.toLocaleLowerCase())}
          </Text>{' '}
          a menos que você já tenha uma conta
        </Text>
        <View style={{ marginTop: 24 }}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                <Text style={[styles.cellTxt]}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.sendAgainRow}>
          <CountdownTimer
            initialTime={50}
            onTimerEnd={() => setCanResend(true)}
            style={styles.timer}
          />
          {/* <Text style={styles.timer}>00:00 </Text> */}
          <TouchableOpacity
            onPress={() => {
              if (canResend) {
                Analytics({ eventName: 'CadastroTokenEmail_EnviarNovamente' });
                setAlertMsg(`Um novo código foi enviado para seu e-mail!`);
                setMsgType('information');
                setShowSnack(true);
                getIdentifier();
                setCanResend(false);
              }
            }}
            disabled={!canResend}>
            <Text
              style={[
                styles.sendAgainTxt,
                !canResend && { color: theme.customColors.neutrals[500] },
              ]}>
              {' '}
              Enviar novamente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
