import React, { useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { GetIdentifierLead, SendIdentifierCellphone } from '@/services/lead';
import CommonMask from '@/helpers/masks';
import { useTheme } from '@/context/MyThemeContext';
import { Platform, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useCustomStyles } from '../../style';
import { Analytics } from '@/helpers/analytics';
import CountdownTimer from '@/components/CountdownTimer';
import PhoneIcon from '@/../assets/newSvgs/icons/call.svg';
import WhatsappIcon from '@/../assets/newSvgs/icons/whatsapp_logo.svg';
import { setIsWpp } from '@/redux/reducers/lead';

type ConfirmPageProps = {
  cellphone: string;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
  setMsgType: React.Dispatch<React.SetStateAction<'error' | 'warning' | 'information'>>;
};

const CELL_COUNT = 6;

export default function ConfirmCellphonePage({
  cellphone,
  setShowSnack,
  setAlertMsg,
  setMsgType,
}: ConfirmPageProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [canResend, setCanResend] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { identifierLeadData, loadingConfirm, hash, isWpp } = useAppSelector(state => state.lead);

  async function onSubmitConfirmPhone() {
    if (value.length < 6) { return }

    try {
      const transaction = identifierLeadData?.transaction;
      if (transaction) {
        await dispatch(
          SendIdentifierCellphone({
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

  async function getIdentifier(isWppIdentifier = isWpp) {
    if (!hash || !hash.hash) { return }
    await dispatch(
      GetIdentifierLead({
        hash: hash.hash,
        reason: 'ConfirmCell',
        wpp: isWppIdentifier
      })
    );
  }

  useEffect(() => {
    Analytics({ pageName: 'CadTokenCelCod' });
    getIdentifier();
  }, []);

  useEffect(() => {
    if (value.length < 6) { return }

    Analytics({ eventName: 'CadTokenCelCod_Continuar' });
    onSubmitConfirmPhone();
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
          Código enviado via {isWpp ? 'Whatsapp' : 'SMS'} para{' '}
          <Text style={{ fontFamily: theme.fonts.bold }}>
            +55 {CommonMask.hidePhone(cellphone)}
          </Text>{' '}
          a menos que você já tenha uma conta
        </Text>
        <TouchableOpacity
          style={[styles.change, { marginBottom: 30 }]}
          onPress={async () => {
            Analytics({
              eventName: `${isWpp ? 'Sms_TrocarWhatsapp' : 'Whatsapp_TrocarSMS'}`,
            });
            setAlertMsg(
              `Um novo código foi enviado via ${isWpp ? 'SMS' : 'Whatsapp'} para seu celular`
            );
            setMsgType('information')
            setShowSnack(true);
            await dispatch(setIsWpp(!isWpp))
            getIdentifier(!isWpp);
          }}>
          <>
            {isWpp ? (
              <PhoneIcon color={theme.colors.text} width={18} height={18} />
            ) : (
              <WhatsappIcon color={theme.colors.text} width={18} height={18} />
            )}
            <Text style={styles.changeTxt}>{isWpp ? 'Tocar para SMS' : 'Trocar para Whatsapp'}</Text>
          </>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }}>
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
          <TouchableOpacity
            onPress={() => {
              if (canResend) {
                Analytics({ eventName: 'CadTokenCelCod_EnviarNovamente' });
                setAlertMsg(`Um novo código foi enviado para seu celular!`);
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
