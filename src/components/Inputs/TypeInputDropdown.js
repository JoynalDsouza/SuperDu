import React, {useRef, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AddTypeInputModal from '../Modal/AddTypeInputModal';
import {Dropdown} from 'react-native-element-dropdown';
import {useRealm} from '@realm/react';
import {alertError} from '../../utils/alertError';

const TypeInputDropdown = ({
  items = [],
  type = '',
  setType = () => {},
  value = '',
  labelField = 'name',
  valueField = 'name',
}) => {
  const [addNewModalVisible, setAddNewModalVisible] = useState(false);

  const dropdownRef = useRef();

  const onSelectItem = item => {
    const {value} = item;

    if (value === 'add new') {
      setAddNewModalVisible(true);
      // setDropdownOpen(false);
      dropdownRef.current?.close();
    } else {
      setType(item.name);
      dropdownRef.current?.close();
      // setDropdownOpen(false);
    }
  };

  const realm = useRealm();

  return (
    <View>
      <Dropdown
        ref={dropdownRef}
        data={[{name: '+ Add New', value: 'add new'}, ...items]}
        labelField={labelField}
        valueField={valueField}
        onChange={onSelectItem}
        value={value}
        placeholder={`Select ${type} type`}
        renderItem={item => {
          return (
            <Pressable
              key={item.name}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'white',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                },
              ]}
              onPress={() => onSelectItem(item)}>
              <Text>{item?.name}</Text>
              {/* {item?.value !== 'add new' && (
                <TouchableOpacity onPress={() => onRemovePress(item.name)}>
                  <Text style={{fontSize: 12, color: 'red'}}>Remove</Text>
                </TouchableOpacity>
              )} */}
            </Pressable>
          );
        }}
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
