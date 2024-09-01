import React, {useState, useEffect, useRef} from 'react';
import Button from './Button';
import {applyOpacityToHexColor} from '../../design/theme';

export type SelectChipProps = {
  isSelected: boolean;
  title: string;
  onPress: () => void;
};

const SelectChip: React.FC<SelectChipProps> = ({
  isSelected,
  title,
  onPress,
}) => {
  return (
    <Button
      debounceTime={0}
      textStyle={{
        fontSize: 14,
      }}
      style={{
        backgroundColor: isSelected ? 'blue' : 'transparent',
        borderWidth: 1,
        borderColor: applyOpacityToHexColor('#ffffff', isSelected ? 45 : 15),
        borderRadius: 30,
      }}
      title={title}
      onPress={onPress}></Button>
  );
};

export default SelectChip;
