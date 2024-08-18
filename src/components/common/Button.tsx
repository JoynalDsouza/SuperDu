import React, {useCallback, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Importing the colors from the palette
import {
  ELECTRIC_BLUE,
  PRIMARY_TEXT,
  SUCCESS_GREEN,
  ERROR_RED,
  VIVID_ORANGE,
  applyOpacityToHexColor,
} from '../../design/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  debounceTime?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'success' | 'error' | 'link';
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  debounceTime = 500,
  style,
  textStyle,
  children,
  disabled,
  type = 'primary',
  backgroundColor,
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

  // Determine button background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'primary':
        return ELECTRIC_BLUE;
      case 'secondary':
        return applyOpacityToHexColor(VIVID_ORANGE, 75);
      case 'success':
        return SUCCESS_GREEN;
      case 'error':
        return ERROR_RED;
      case 'link':
        return 'transparent';
      default:
        return ELECTRIC_BLUE;
    }
  };

  // Determine text style based on type
  const getTextStyle = () => {
    if (type === 'link') {
      return [styles.linkText, textStyle];
    }
    return [styles.buttonText, textStyle];
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor || getBackgroundColor(),
          opacity: buttonDisabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={buttonDisabled}
      {...otherProps}>
      <Text style={getTextStyle()}>{title}</Text>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: PRIMARY_TEXT,
    fontSize: 16,
  },
  linkText: {
    color: ELECTRIC_BLUE,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Button;
