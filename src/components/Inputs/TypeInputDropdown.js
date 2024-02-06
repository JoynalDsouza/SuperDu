import React, {useState} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import AddTypeInputModal from '../Modal/AddTypeInputModal';
import {Dropdown} from 'react-native-element-dropdown';

const TypeInputDropdown = ({
  items = [],
  type = '',
  setType = () => {},
  value = '',
  labelField = 'name',
  valueField = 'name',
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
      <Dropdown
        data={[{name: '+ Add New', value: 'add new'}, ...items]}
        labelField={labelField}
        valueField={valueField}
        onChange={onSelectItem}
        value={value}
        placeholder={`Select ${type} type`}
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
