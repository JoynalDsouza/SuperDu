import {alertError} from '../alertError';
import {Alert} from 'react-native';

// Path: src/utils/__tests__/alertError.test.js

describe('alertError function testing', () => {
  it('should match the snapshot', () => {
    expect(alertError).toMatchSnapshot();
  });
  it('should call Alert.alert with "Error" and error message', () => {
    const error = new Error('Test error message');
    const alertSpy = jest.spyOn(Alert, 'alert');
    alertError(error);

    expect(alertSpy).toHaveBeenCalledWith('Error', error.message);
  });
  it('should call Alert.alert with "Error" and error message', () => {
    const error = 'Test error message';
    const alertSpy = jest.spyOn(Alert, 'alert');
    alertError(error);
    expect(alertSpy).toHaveBeenCalledWith('Error', error);
  });
  it('if no error parameter is passed, it should not call anything', () => {
    const res = alertError();
    expect(res).toBeUndefined();
  });
});
