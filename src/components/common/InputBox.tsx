import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';
import {validateInput} from '../../utils/inputValidation';
import Text from './Text';
import {ERROR_RED} from '../../design/theme';

type InputType = 'text' | 'email' | 'password';

type InputBoxProps = {
  type?: InputType;
  label?: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  error?: string;
  setError?: (error: string) => void;
} & TextInputProps;

const InputBox: React.FC<InputBoxProps> = ({
  type = 'text',
  label,
  inputValue,
  setInputValue,
  error = '',
  setError,
  ...textInputProps
}) => {
  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (setError) setError(''); // Clear error on input change if setError is provided
  };

  const handleInputBlur = () => {
    if (setError) setError(validateInput(type, inputValue));
  };

  return (
    <View style={styles.container}>
      {!!label && <Text variant="b2">{label}</Text>}
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        onBlur={handleInputBlur}
        {...textInputProps}
      />
      {error ? (
        <Text color={ERROR_RED} variant="b2">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 4,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default InputBox;
