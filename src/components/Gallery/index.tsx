import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCustomStyles } from './style';
import { ThumbsProps } from '@/models-old/types/Thumbs';
import WebView from 'react-native-webview';
import { ImageBackground, Text, View } from 'react-native';
import BottomSheet from '../BottomSheet';
import ArrowRightIcon from '@/../assets/newSvgs/icons/keyboard_arrow_right.svg';
import ArrowLeftIcon from '@/../assets/newSvgs/icons/keyboard_arrow_left.svg';
import BtnIcon from '../BtnIcon';
import CloseIcon from '@/../assets/newSvgs/icons/close_small.svg';
import { useTheme } from '@/context/MyThemeContext';

type GalleryProps = {
  arrGallery?: ThumbsProps;
  galleryIndex: number;
  setGalleryIndex: React.Dispatch<React.SetStateAction<number>>;
  refRBSheet: any;
};

export default function GalleryComp({
  arrGallery,
  galleryIndex,
  setGalleryIndex,
  refRBSheet,
}: GalleryProps) {
  const { theme } = useTheme();
  const styles = useCustomStyles();

  function onClose() {
    refRBSheet.current?.close();
  }

  function onNext() {
    if (arrGallery && galleryIndex === arrGallery.length - 1) {
      onClose();
    } else {
      setGalleryIndex(++galleryIndex);
    }
  }

  function onPreviews() {
    if (galleryIndex === 0) {
      onClose();
    } else {
      setGalleryIndex(--galleryIndex);
    }
  }

  if (arrGallery && !arrGallery[galleryIndex]) {
    <></>;
  }

  return (
    <BottomSheet refRBSheet={refRBSheet} height={600}>
      <View style={styles.header}>
        <Text style={styles.title}>Foto empresa</Text>
        <BtnIcon
          style={styles.btnClose}
          width={28}
          height={28}
          bgColor={theme.customColors.baseWhite}
          onPress={() => onClose()}>
          <CloseIcon color={theme.customColors.baseBlack} width={16} height={16} />
        </BtnIcon>
      </View>

      {arrGallery?.length && (
        <View
          style={{
            marginHorizontal: -16,
            top: -7,
            position: 'relative',
          }}>
          {arrGallery && arrGallery[galleryIndex].type === 'img' ? (
            <ImageBackground
              source={{ uri: arrGallery && arrGallery[galleryIndex].thumb }}
              resizeMode="contain"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{ height: 250, width: '100%' }}>
                <WebView
                  javaScriptEnabled={true}
                  source={{
                    uri: `https://www.youtube.com/embed/ci0tuIAAvTY?si=qvgBxyfRVzK7x8mU&showinfo=0`,
                  }}
                />
              </View>
            </View>
          )}
          {galleryIndex !== 0 ? (
            <View style={{ ...styles.arrowBtn, left: 16 }}>
              <TouchableOpacity onPress={onPreviews}>
                <ArrowLeftIcon width={32} height={32} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          {arrGallery.length - 1 !== galleryIndex ? (
            <View style={{ ...styles.arrowBtn, right: 16 }}>
              <TouchableOpacity onPress={onNext}>
                <ArrowRightIcon width={32} height={32} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </View>
      )}
    </BottomSheet>
  );
}
