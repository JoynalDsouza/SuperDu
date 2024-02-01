import React, {useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AddTypeInputModal from '../Modal/AddTypeInputModal';

const TypeInputDropdown = ({
  items = [],
  type = '',
  setType = () => {},
  value = '',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [addNewModalVisible, setAddNewModalVisible] = useState(false);

  const onSelectItem = item => {
    const {value} = item;
    if (value === 'add new') {
      setAddNewModalVisible(true);
      // setDropdownOpen(false);
    } else {
      setType(item.name);
      setDropdownOpen(false);
    }
  };

  return (
    <View>
      <DropDownPicker
        open={dropdownOpen}
        schema={{
          label: 'name',
          value: 'name',
        }}
        placeholder={`Select ${type} type`}
        items={[{name: '+ Add New', value: 'add new'}, ...items]}
        value={{name: 'hello', value: value}}
        setOpen={() => {
          setDropdownOpen(!dropdownOpen);
        }}
        onSelectItem={onSelectItem}
      />

      <AddTypeInputModal
        visible={addNewModalVisible}
        setVisible={setAddNewModalVisible}
        type={type}
        setType={setType}
      />
    </View>
  );
};

export default TypeInputDropdown;
