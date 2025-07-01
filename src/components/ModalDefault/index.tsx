import React from 'react';
import { useCustomStyles } from './style';
import { Text, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import BtnIcon from '../BtnIcon';
import { useTheme } from '@/context/MyThemeContext';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';

type HeaderProps = {
  title?: string;
  desc?: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModalDefault({ visible, setVisible, desc, title }: HeaderProps) {
  const styles = useCustomStyles();
  const { theme } = useTheme();

  const hideModal = () => setVisible(false);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
        <View style={styles.container}>
          {title && (
            <View style={styles.header}>
              <Text style={styles.headTitle}>{title}</Text>
              <BtnIcon
                style={styles.btnClose}
                width={28}
                height={28}
                bgColor={theme.customColors.baseWhite}
                onPress={hideModal}>
                <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
              </BtnIcon>
            </View>
          )}
          {desc && (
            <View style={styles.content}>
              <Text style={styles.desc}>{desc}</Text>
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
}
