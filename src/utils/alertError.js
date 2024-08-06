import {Alert} from 'react-native';

export const alertError = error => {
  try {
    const title = error?.title || 'Error';
    Alert.alert(title, error.message || error);
  } catch (e) {}
};
