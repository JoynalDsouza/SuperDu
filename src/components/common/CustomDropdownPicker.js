import React, {useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const CustomDropdownPicker = ({
  items = [],
  value = '',
  placeholder = '',
  setValue = () => {},
  contentContainerStyle = {},
  labelField = 'name',
  valueField = 'value',
  ...otherDropdownProps
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onSelectItem = item => {
    setDropdownOpen(false);
    setValue(item);
  };
  return (
    <View style={contentContainerStyle}>
      <Dropdown
        data={items}
        onSelectItem={onSelectItem}
        placeholder={placeholder}
        labelField={labelField}
        valueField={valueField}
        onChange={onSelectItem}
        value={value}
        {...otherDropdownProps}
      />
    </View>
  );
};

export default CustomDropdownPicker;
