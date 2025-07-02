import React, {useEffect} from 'react';
import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useState} from 'react';
import {useRealm} from '@realm/react';
import {alertError} from '../../utils/alertError';
import {TRANSACTION_CATEGORY_TYPES} from '../../utils/constants/transactions';
import {Dropdown} from 'react-native-element-dropdown';
import {
  applyOpacityToHexColor,
  PRIMARY_BACKGROUND,
  SECONDARY_BACKGROUND,
} from '../../design/theme';

type AddTypeInputModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  handleAddNewCategory: (
    {
      value,
      categoryType,
    }: {
      value: string;
      categoryType: string;
    },
    category?: any,
  ) => void;
  category?: any;
};

const AddTypeInputModal: React.FC<AddTypeInputModalProps> = ({
  visible,
  setVisible = () => {},
  type = '',
  handleAddNewCategory = value => {},
  category,
}) => {
  const mode = category ? 'edit' : 'add';

  const [initialValue, setInitialValue] = useState({
    value: '',
    selectedCategoryType: TRANSACTION_CATEGORY_TYPES[0],
  });

  const [value, setValue] = useState('');

  const categoryTypeDropdownData = TRANSACTION_CATEGORY_TYPES;

  const [selectedCategoryType, setSelectedCategoryType] = useState(
    categoryTypeDropdownData[0],
  );

  useEffect(() => {
    if (mode == 'edit') {
      const categoryType = categoryTypeDropdownData.find(
        item => item.value === category.transactionCategory,
      );
      setValue(category.name);
      setSelectedCategoryType(categoryType || categoryTypeDropdownData[0]);
      setInitialValue({
        value: category.name,
        selectedCategoryType: categoryType,
      });
    }
  }, []);

  const onAddPress = () => {
    if (value.trim()) {
      handleAddNewCategory(
        {
          value,
          categoryType:
            type === 'EXPENSE'
              ? selectedCategoryType.value
              : type === 'INVESTMENT' || type === 'LENDING'
              ? 'SAVINGS'
              : '',
        },
        category,
      );
      setValue('');
    } else {
      Alert.alert('Please enter a valid category name');
    }
  };

  const isEdited =
    value.trim() !== initialValue.value ||
    selectedCategoryType?.value !== initialValue.selectedCategoryType?.value;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{marginBottom: 10, color: 'white'}}>
            {`${mode === 'edit' ? 'Edit' : 'Add'}`} {type.toLowerCase()}{' '}
            category
          </Text>
          <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
            <Text style={{color: 'white'}}>Name : </Text>

            <View style={{flex: 1}}>
              <InputBox
                placeholder={'Enter name'}
                inputValue={value}
                setInputValue={setValue}
                placeholderTextColor={'rgba(255,255,255,0.5)'}
                style={{color: 'white'}}
              />
            </View>
          </View>

          {type === 'EXPENSE' && (
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>{`Type :    `}</Text>
              <Dropdown
                style={{flex: 1}}
                labelField={'name'}
                valueField={'value'}
                selectedTextStyle={{
                  color: 'white',
                }}
                value={selectedCategoryType}
                data={categoryTypeDropdownData}
                renderItem={category => {
                  return (
                    <View
                      key={category.name}
                      style={[
                        {
                          backgroundColor: 'black',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'row',
                          paddingVertical: 8,
                          paddingHorizontal: 8,
                        },
                      ]}>
                      <Text style={{color: 'white'}}>{category?.name}</Text>
                    </View>
                  );
                }}
                onChange={category => {
                  setSelectedCategoryType(category);
                }}></Dropdown>
            </View>
          )}
          <View style={{flexDirection: 'row', gap: 16}}>
            <Button
              title={'Cancel'}
              type="secondary"
              style={{flex: 1}}
              onPress={() => setVisible(false)}
            />
            <Button
              title={mode === 'edit' ? 'Edit' : 'Add'}
              style={{flex: 1}}
              disabled={!value.trim() || !isEdited}
              onPress={onAddPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: applyOpacityToHexColor(PRIMARY_BACKGROUND, 80),
  },
  modalView: {
    margin: 20,
    gap: 16,
    backgroundColor: SECONDARY_BACKGROUND,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddTypeInputModal;
