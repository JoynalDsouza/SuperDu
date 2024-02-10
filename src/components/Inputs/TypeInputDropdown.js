import React, {useState} from 'react';
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

  const realm = useRealm();

  const removeType = (schemaName, value) => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          schemaName,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          realm.write(() => {
            realm.create(
              schemaName,
              {
                name: typeExsits.name,
                isActive: false,
              },
              'modified',
            );
          });

          if (type === value) {
            setType('');
          }
        }
      }
    } catch (e) {
      alertError(e);
    }
  };

  const onRemovePress = value => {
    if (value) {
      switch (type) {
        case 'expense':
          removeType('ExpenseType', value);
          break;
        case 'income':
          removeType('IncomeType', value);
          break;
        case 'investment':
          removeType('InvestmentType', value);
          break;
        case 'lending':
          removeType('LendingType', value);
          break;
        default:
          break;
      }
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
        renderItem={item => {
          return (
            <Pressable
              key={item.name}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'rgba(0, 0, 0, 0.1)' : 'white',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingVertical: 4,
                  paddingHorizontal: 4,
                },
              ]}
              onPress={() => onSelectItem(item)}>
              <Text>{item?.name}</Text>
              {item?.value !== 'add new' && (
                <TouchableOpacity onPress={() => onRemovePress(item.name)}>
                  <Text style={{fontSize: 10, color: 'red'}}>Remove</Text>
                </TouchableOpacity>
              )}
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
