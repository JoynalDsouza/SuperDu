import React, {useState} from 'react';
import {View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const TypeInputDropdown = ({items = [], type = '', setType = () => {}}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onChangeValue = value => {
    if (value === 'add new') {
    } else {
      setType(value);
      setDropdownOpen(false);
    }
  };

  const onSelectItem = item => {
    const {value} = item;
    if (value === 'add new') {
      setDropdownOpen(false);
    } else {
      setType(value);
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
        setOpen={() => {
          setDropdownOpen(!dropdownOpen);
        }}
        onSelectItem={onSelectItem}
      />
    </View>
  );
};

export default TypeInputDropdown;
