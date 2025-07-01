import React, { useEffect, useRef, useState } from 'react';
import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Analytics } from '@/helpers/analytics';
import BtnDefault from '@/components/BtnDefault';
import * as Clipboard from 'expo-clipboard';
import { Checkbox, HelperText } from 'react-native-paper';
import { Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { PublicNavigation } from '@/models/routes/navigation.public';
import { LeadRequest } from '@/models/lead/lead.request';
import { PostLead } from '@/services/lead';
import BottomsheetTerms from '@/components/BottomsheetTerms';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/context/MyThemeContext';
import CommonClears from '@/helpers/clears/common.clear';
import CommonValidators from '@/helpers/validators/common.validators';
import { useCustomStyles } from '../../style';
import BottomSheetTypeSendCell from '@/components/BottomSheetTypeSendCell';
import { setIsWpp } from '@/redux/reducers/lead';

type GeneralProps = {
  setGeneralInfos: React.Dispatch<React.SetStateAction<LeadRequest>>;
  generalInfos: LeadRequest;
  setShowSnack: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMsg: React.Dispatch<React.SetStateAction<string>>;
};

export default function GeneralPage({
  setGeneralInfos,
  generalInfos,
  setShowSnack,
  setAlertMsg,
}: GeneralProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();
  const nav = useNavigation<PublicNavigation>();
  const refRBSheet = useRef<RBSheet>(null);
  const refRBSheetTypeSend = useRef<RBSheet>(null);
  const { publicTerms } = useAppSelector(state => state.common);
  const { loadingPost } = useAppSelector(state => state.lead);
  const dispatch = useAppDispatch();
  const [error, setError] = useState({
    cellphone: '',
    terms: '',
  });
  const [checked, setChecked] = useState<boolean>(true);
  const { deviceToken } = useAuth();

  useEffect(() => {
    Analytics({ pageName: 'CadastroTokenCelular' });
  }, []);

  function handleField(value: React.SetStateAction<string>, field: string) {
    setGeneralInfos({ ...generalInfos, [field]: value });
  }

  async function handleInitLead() {
    Analytics({ eventName: 'CadastroTokenCelular_Continuar' });

    if (!generalInfos.cellphone) { return }

    await dispatch(
      PostLead({
        inviteCode: generalInfos.inviteCode,
        idTerm: publicTerms?.idTerm,
        cellphone: CommonClears.clearPhone(generalInfos.cellphone),
        deviceToken,
        amountToInvest: '0',
      })
    );
  }

  function toggleChecked() {
    setChecked(!checked);
  }

  const onOpen = () => {
    refRBSheet.current?.open();
  };

  const onOpenSendCell = async () => {
    const phoneValidator = CommonValidators.isCellphoneValid(generalInfos.cellphone || '');

    setError({
      terms: checked ? '' : 'Aceitar os termos é obrigatório!',
      cellphone: phoneValidator.error,
    });

    if (phoneValidator.status) {
      refRBSheetTypeSend.current?.open()
    }
  }

  const onCloseSendCell = async (isWppClosed: boolean) => {
    await dispatch(setIsWpp(isWppClosed))

    if (generalInfos.cellphone && checked) {
      await handleInitLead()
    }
  }

  async function handleGetInitialInvite() {
    const initialUrl = await Clipboard.getStringAsync();

    if (initialUrl) {
      setGeneralInfos({ ...generalInfos, ['inviteCode']: initialUrl });
    }
  }
  useEffect(() => {
    if (error.terms) {
      setAlertMsg(error.terms);
      setShowSnack(true);
    }
  }, [error.terms]);

  return (
    <>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Text style={styles.title}>Vamos começar!</Text>
        <Text style={styles.desc}>
          Entre com seu número de telefone. Nós enviaremos código de confirmação.
        </Text>
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
              setValue={value => handleField(value, 'cellphone')}
              placeholder="Telefone celular *"
              value={generalInfos.cellphone || ''}
              keyboardType="number-pad"
              autoComplete="tel"
              mask="phone"
              maxLength={15}
              error={!!error.cellphone}
              txtError={error.cellphone}
            />
          </View>
        </View>
        <Text style={styles.descInput}>Tem um Código de indicação? Insira-o abaixo</Text>

        <View style={{ position: 'relative' }}>
          <Input
            setValue={value => handleField(value, 'inviteCode')}
            placeholder="Insira o Código *"
            value={generalInfos.inviteCode?.toUpperCase() || ''}
            maxLength={15}
            border
            autoCapitalize="none"
            mode="flat"
          />
          <TouchableOpacity style={styles.pasteBlock} onPress={handleGetInitialInvite}>
            <Text style={styles.paste}>Colar código</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox.Item
            label=""
            status={checked ? 'checked' : 'unchecked'}
            mode="android"
            onPress={toggleChecked}
            color={theme.dark ? theme.customColors.baseWhite : theme.customColors.secondary.default}
            uncheckedColor={
              theme.dark ? theme.customColors.baseWhite : theme.customColors.secondary.default
            }
            style={{ marginLeft: -16, marginRight: -8 }}
          />
          <Text style={{ ...styles.subDesc, flex: 1 }}>
            Eu li e declaro que aceito os{' '}
            <TouchableOpacity style={{ padding: 0, margin: 0 }} onPress={onOpen}>
              <Text
                style={{
                  ...styles.subDesc,
                  fontFamily: theme.fonts.bold,
                  top: 3,
                  textDecorationLine: 'underline',
                }}>
                Termos e Condições
              </Text>
            </TouchableOpacity>{' '}
            para investidores do aplicativo Wealth Money.
          </Text>
        </View>
        {error.terms && (
          <HelperText type="error" theme={{ colors: { error: theme.customColors.error.default } }}>
            {error.terms}
          </HelperText>
        )}

        <View style={styles.login}>
          <Text style={styles.loginTxt}>Você já tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => {
              Analytics({ eventName: 'CadastroTokenCelular_EfetuarLogin' });
              nav.navigate('Login' as never);
            }}>
            <Text style={{ ...styles.loginTxt, color: theme.customColors.hyperlink }}>
              Clique aqui!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BtnDefault label="Continuar" onPress={onOpenSendCell} loading={loadingPost} style={{ marginBottom: 15 }} />
      <BottomsheetTerms refRBSheet={refRBSheet} />
      <BottomSheetTypeSendCell
        cellPhone={generalInfos.cellphone}
        refRBSheet={refRBSheetTypeSend}
        onClose={(value) => onCloseSendCell(value)}
      />
    </>
  );
}
