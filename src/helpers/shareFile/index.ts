import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AuthStorage from '@/storages/auth-storage';
import refreshToken from '../refreshToken';

export default async function ShareFile(url: string, name?: string, newToken?: string) {
  const token = await AuthStorage.GetPrivateToken();
  const fileUri: string = `${FileSystem.documentDirectory}${name}`;
  const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(
    url,
    fileUri,
    {
      headers: {
        Authorization: `Bearer ${newToken || token}`,
      },
    }
  );

  if (downloadedFile.status !== 200) {
    const refresh = await refreshToken();
    const accessToken = refresh.accessToken;
    ShareFile(url, name, accessToken);
  } else {
    const UTI = 'public.item';
    const shareResult = await Sharing.shareAsync(downloadedFile.uri, { UTI });
  }
}
