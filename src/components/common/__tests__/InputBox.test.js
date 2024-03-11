import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import InputBox from '../InputBox'; // Adjust the import path as necessary

// Mock the utility function 'vaildateInput' if it's not available in the test environment
jest.mock('../../../utils/inputValidation', () => ({
  vaildateInput: jest.fn().mockImplementation((type, value) => {
    if (value.trim() === '') return 'Field cannot be empty';
    // Add more validation logic as necessary
    return '';
  }),
}));

describe('InputBox Component', () => {
  const setup = (props = {}) => {
    const utils = render(<InputBox {...props} testID={'input-box'} />);
    const input = utils.getByTestId('input-box');
    return {
      input,
      ...utils,
    };
  };

  test('should render correctly with the given label', () => {
    const {getByText} = setup({label: 'Test Label'});
    expect(getByText('Test Label')).toBeTruthy();
  });

  test('should update value on text change', () => {
    const setInputValue = jest.fn();
    const {input} = setup({inputValue: '', setInputValue});
    fireEvent.changeText(input, 'new value');
    expect(setInputValue).toHaveBeenCalledWith('new value');
  });

  test('should validate input on blur', () => {
    const setError = jest.fn();
    const {input} = setup({inputValue: '', setError});
    fireEvent(input, 'blur');
    expect(setError).toHaveBeenCalledWith('Field cannot be empty');
  });

  test('should display error text when error prop is provided', () => {
    const {getByText} = setup({error: 'Error message'});
    expect(getByText('Error message')).toBeTruthy();
  });
});
