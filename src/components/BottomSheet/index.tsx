import React, { ReactNode } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/MyThemeContext';

type Props = {
  children: ReactNode;
  height?: number;
  refRBSheet: any;
  draggable?: boolean;
  background?: string;
  onClose?(): void;
  onOpen?(): void;
};

export default function BottomSheet({
  children,
  height = 320,
  refRBSheet,
  draggable = true,
  background,
  onClose,
  onOpen,
}: Props) {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnPressMask
      dragFromTopOnly={draggable}
      // dragOnContent={draggable}
      // draggable={true}
      height={height}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      onOpen={() => {
        if (onOpen) {
          onOpen();
        }
      }}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        draggableIcon: {
          backgroundColor: theme.customColors.baseWhite,
          margin: 0,
          borderRadius: 0,
          width: 80,
          height: 4,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
        container: {
          backgroundColor: background
            ? background
            : theme.dark
            ? theme.customColors.neutrals[800]
            : theme.customColors.secondary.default,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          paddingBottom: bottom,
          paddingHorizontal: 16,
        },
      }}>
      {children}
    </RBSheet>
  );
}
