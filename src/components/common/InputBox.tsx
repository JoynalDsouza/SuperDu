import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {validateInput} from '../../utils/inputValidation';

const InputBox = ({
  type = 'text',
  label,
  inputValue,
  setInputValue = value => {},
  error = '',
  setError = string => {},
  ...textInputProps
}) => {
  const handleInputChange = text => {
    setInputValue(text);
    setError('');
  };

  const handleInputBlur = () => {
    setError(validateInput(type, inputValue));
  };

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleInputChange}
        onBlur={handleInputBlur}
        {...textInputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});

export default InputBox;
