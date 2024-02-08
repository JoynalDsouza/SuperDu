import {Alert} from 'react-native';

export const alertError = error => {
  Alert.alert('Error', error.message || error);
};
