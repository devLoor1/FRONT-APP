import {
  isDevice,
  brand,
  manufacturer,
  modelName,
  deviceYearClass,
  totalMemory,
  supportedCpuArchitectures,
  osName,
  osVersion,
  osBuildId,
  osInternalBuildId,
} from 'expo-device';
import Constants from 'expo-constants';

const deviceData = JSON.stringify({
  isDevice: Constants?.expoConfig?.extra?.env?.production === true ? isDevice : true,
  brand,
  manufacturer,
  modelName,
  deviceYearClass,
  totalMemory,
  supportedCpuArchitectures: supportedCpuArchitectures?.toString(),
  osName,
  osVersion,
  osBuildId,
  osInternalBuildId,
});

export default deviceData;
