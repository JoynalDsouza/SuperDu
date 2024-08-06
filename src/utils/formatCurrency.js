import {alertError} from './alertError';

export const formatToINR = value => {
  try {
    if (typeof Number(value) !== 'number' || !value) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(0);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  } catch (e) {
    return 'undefined';
  }
};
