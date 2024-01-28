import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';

const isValidEmail = email => {
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidText = text => {
  // Simple text validation regex
  const textRegex = /^[a-zA-Z]+$/;
  return textRegex.test(text);
};

const isValidAlphaNumeric = text => {
  // Simple text validation regex
  const textRegex = /^[a-zA-Z0-9]+$/;
  return textRegex.test(text);
};

const vaildate = (type, value) => {
  if (type === 'email') {
    if (!value) {
      return 'Email is required';
    }
    if (!isValidEmail(value)) {
      return 'Invalid email address';
    }
  } else if (type === 'alphaNumeric') {
    if (!value?.trim()?.length === 0) {
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

const InputBox = ({
  type = 'text',
  label,
  placeholder,
  inputValue,
  setInputValue = () => {},
  onChangeText = () => {},
  keyboardType,
  error = '',
  setError = () => {},
  ...textInputProps
}) => {
  const handleInputChange = text => {
    setInputValue(text);
    setError('');
    onChangeText(text); // Propagate the input value to the parent component if needed
  };

  const handleInputBlur = () => {
    setError(vaildate(type, inputValue));
  };

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={inputValue}
        onChangeText={handleInputChange}
        onBlur={handleInputBlur}
        keyboardType={keyboardType}
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
