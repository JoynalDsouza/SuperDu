import {vaildateInput} from '../inputValidation';

describe('vaildateInput', () => {
  it('take snapshot of vaildateInput', () => {
    expect(vaildateInput).toMatchSnapshot();
  });

  it('should return a error message for email', () => {
    const type = 'email';
    const value = '';
    expect(vaildateInput(type, value)).toEqual('Email is required');
  });

  it('should return a error message for invalid email', () => {
    const type = 'email';
    const value = 'test@';
    expect(vaildateInput(type, value)).toEqual('Invalid email address');
  });

  it('should return a error message for alphaNumeric', () => {
    const type = 'alphaNumeric';
    const value = '';
    expect(vaildateInput(type, value)).toEqual('This field is required');
  });

  it('should return a error message for alphaNumeric', () => {
    const type = 'alphaNumeric';
    const value = 'ab';
    expect(vaildateInput(type, value)).toEqual(
      'This field must be at least 3 characters',
    );
  });

  it('should return a error message for alphaNumeric', () => {
    const type = 'alphaNumeric';
    const value = 'ab@';
    expect(vaildateInput(type, value)).toEqual('This field must be text only');
  });
});
