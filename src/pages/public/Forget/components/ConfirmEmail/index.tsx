import React, { useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Snack from '~/components/Snack';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { SendIdentifier } from '~/services/register';
import { Analytics } from '~/helpers/analytics';
import { useCustomStyles } from '../../style';
import { useTheme } from '~/context/MyThemeContext';
import { ScrollView } from 'react-native-gesture-handler';
import { Platform, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import CommonMask from '~/helpers/masks';
import CountdownTimer from '~/components/CountdownTimer';

type ConfirmPageProps = {
  email: string;
  getIdentifier(): Promise<void>;
};

const CELL_COUNT = 6;

export default function ConfirmEmailPage({ getIdentifier, email }: ConfirmPageProps) {
  const dispatch = useAppDispatch();
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const [value, setValue] = useState('');
  const [canResend, setCanResend] = useState(false);
  const { identifierData, loadingConfirm } = useAppSelector(state => state.register);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [showSnack, setShowSnack] = useState(false);

  useEffect(() => {
    if (value.length < 6) { return }

    Analytics({ eventName: 'EsqueceuSenhaCodigo_Continuar' });
    onSubmitConfirmEmail();
  }, [value]);

  useEffect(() => {
    Analytics({ pageName: 'EsqueceuSenhaCodigo' });
  }, []);

  async function onSubmitConfirmEmail() {
    const transaction = identifierData?.transaction;
    if (transaction) {
      await dispatch(
        SendIdentifier({
          transaction,
          code: value,
        })
      );
    }
  }

  return (
    <>
      {loadingConfirm && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.desc}>
          Digite abaixo o <Text style={{ fontFamily: theme.fonts.bold }}>código de 6 dígitos</Text>{' '}
          que enviamos para o E-mail{' '}
          <Text style={{ fontFamily: theme.fonts.bold }}>{CommonMask.email(email)}</Text>
        </Text>
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
                Analytics({ eventName: 'EsqueceuSenhaCodigo_Reenviar' });
                setShowSnack(true);
                setCanResend(false);
                return getIdentifier();
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
      </ScrollView>
      <View style={styles.footer}>
      </View>
      <Snack
        visible={showSnack}
        type="information"
        txt="Um novo código foi enviado para seu e-mail!"
        setShowSnack={setShowSnack}
      />
    </>
  );
}
