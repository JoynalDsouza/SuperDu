import React, {useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const CustomDropdownPicker = ({
  items = [],
  value = '',
  placeholder = '',
  setValue = () => {},
  contentContainerStyle = {},
  ...otherDropdownProps
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onSelectItem = item => {
    setDropdownOpen(false);
    setValue(item);
  };

  return (
    <View style={contentContainerStyle}>
      <DropDownPicker
        items={items}
        open={dropdownOpen}
        placeholder={placeholder}
        value={value}
        setOpen={() => {
          setDropdownOpen(!dropdownOpen);
        }}
        onSelectItem={onSelectItem}
        {...otherDropdownProps}
      />
    </View>
  );
};

export default CustomDropdownPicker;
