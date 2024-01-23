import React, {useState, useCallback} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Button = ({
  title,
  onPress = () => {},
  debounceTime = 500,
  style,
  children,
  disabled,
  ...otherProps
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      setIsDisabled(true);
      onPress();

      // Allow the button to be pressed again after the debounce time
      setTimeout(() => {
        setIsDisabled(false);
      }, debounceTime);
    }
  }, [isDisabled, onPress, debounceTime]);

  const buttonDisabled = isDisabled || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, style, {opacity: buttonDisabled ? 0.5 : 1}]}
      onPress={handlePress}
      disabled={buttonDisabled}
      {...otherProps}>
      <Text style={styles.buttonText}>{title}</Text>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;
