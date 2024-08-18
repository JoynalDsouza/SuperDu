// TextComponent.tsx

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import TYPOGRAPHY, {FONT_SIZE} from '../../design/typography';

interface TextComponentProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'b1' | 'b2' | 'caption' | 'button';
  color?: string; // Custom color for the text
  align?: 'left' | 'center' | 'right' | 'justify'; // Text alignment options
  weight?: 'normal' | 'bold'; // Font weight options
  italic?: boolean; // Italic styling
  fontSize?: number; // Custom font size
  fontFamily?: string; // Custom font family
  style?: TextStyle; // Additional styles
}

const Text: React.FC<TextComponentProps> = ({
  variant = 'b1',
  color,
  align = 'left',
  weight = 'normal',
  italic = false,
  fontSize,
  fontFamily,
  style,
  children,
  ...otherProps
}) => {
  const customStyle: TextStyle = {
    color: color ? color : TYPOGRAPHY[variant].color,
    textAlign: align,
    fontWeight: weight,
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: fontSize || TYPOGRAPHY[variant].fontSize,
    fontFamily: fontFamily || TYPOGRAPHY[variant].fontFamily,
  };

  return (
    <RNText style={[TYPOGRAPHY[variant], customStyle, style]} {...otherProps}>
      {children}
    </RNText>
  );
};

export default Text;
