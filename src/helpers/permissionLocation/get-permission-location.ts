import * as Location from 'expo-location';

export const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status === 'granted') {
        return true;
    } else {
        return false
    }
};
