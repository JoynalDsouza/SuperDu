import {isValidAlphaNumeric, isValidEmail} from './regex';

export const vaildateInput = (type, value) => {
  if (type === 'email') {
    if (!value) {
      return 'Email is required';
    }
    if (!isValidEmail(value)) {
      return 'Invalid email address';
    }
  } else if (type === 'alphaNumeric') {
    if (value?.trim()?.length === 0) {
      return 'This field is required';
    }
    if (value?.trim()?.length < 3) {
      return 'This field must be at least 3 characters';
    }
    if (!isValidAlphaNumeric(value)) {
      return 'This field must be text only';
    }
  }
  return '';
};
