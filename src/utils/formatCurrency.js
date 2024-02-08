import {alertError} from './alertError';

export const formatToINR = value => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  } catch (e) {
    alertError(e);
    return value;
  }
};
