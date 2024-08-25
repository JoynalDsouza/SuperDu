import {
  BackHandler,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {BSON} from 'realm';
import Text from '../components/common/Text';
import {
  applyOpacityToHexColor,
  ERROR_RED,
  PRIMARY_BACKGROUND,
} from '../design/theme';
import Button from '../components/common/Button';
import {rootNavigate} from '../Navigation/navigation';
import {Dropdown} from 'react-native-element-dropdown';
import InputBox from '../components/common/InputBox';
import {useQuery, useRealm} from '@realm/react';
import {Category, CategoryType, Transaction} from '../realm/models/Account';
import {alertError} from '../utils/alertError';
import {getDate} from '../utils/moment';
import DateTimePicker from 'react-native-ui-datepicker';
import {showAlertDialog} from '../utils/alert-utils';
import {
  TRANSACTION_COLOR,
  TRANSACTION_TYPES,
} from '../utils/constants/transactions';
import ScreenHeader from '../components/common/ScreenHeader';
import AddTypeInputModal from '../components/Modal/AddTypeInputModal';

const ManageCategories = ({route}) => {
  const realm = useRealm();

  const [addNewModalVisible, setAddNewModalVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const ALL_CATEGORIES = useQuery(Category).filtered('isActive == true');

  const transactionTypeDropdownData = TRANSACTION_TYPES;

  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionTypeDropdownData[0],
  );

  const filteredCategories = ALL_CATEGORIES.filtered(
    `type == "${selectedTransactionType.value}"`,
  );

  const handleAddNewCategory = ({value = '', categoryType = ''}, category) => {
    try {
      if (category) {
        realm.write(() => {
          category.name = value;
          category.transactionCategory = categoryType;
        });
        showAlertDialog({
          title: 'Success',
          message: 'Category updated successfully',
        });
      } else {
        const checkCategoryExists = filteredCategories.find(
          item => item.name.toLowerCase() === value.toLowerCase(),
        );
        if (checkCategoryExists) {
          if (!checkCategoryExists.isActive) {
            realm.write(() => {
              checkCategoryExists.isActive = true;
            });
          }
        } else {
          const _id = new BSON.ObjectId();

          realm.write(() => {
            realm.create('Category', {
              _id: _id,
              name: value,
              image: '',
              type: selectedTransactionType.value,
              transactionCategory: categoryType || '',
              isActive: true,
            });
          });
        }
        showAlertDialog({
          title: 'Success',
          message: 'Category added successfully',
        });
      }

      setAddNewModalVisible(false);
    } catch (error) {}
  };

  const buttonBackgroundColor =
    TRANSACTION_COLOR[selectedTransactionType.value];

  return (
    <View
      style={{
        backgroundColor: PRIMARY_BACKGROUND,
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flex: 1,
      }}>
      <ScreenHeader
        customCenterComponent={
          <Text
            variant="h2"
            style={{
              textTransform: 'capitalize',
            }}>{`${selectedTransactionType.value} Categories`}</Text>
        }
        title={`${selectedTransactionType.value} Categories`}
      />

      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Text>Transaction Type : </Text>
        <Dropdown
          style={{flex: 1}}
          labelField={'name'}
          valueField={'value'}
          selectedTextStyle={{
            color: 'white',
          }}
          value={selectedTransactionType}
          data={transactionTypeDropdownData}
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
                <Text>{category?.name}</Text>
              </View>
            );
          }}
          onChange={category => {
            setSelectedTransactionType(category);
          }}></Dropdown>
      </View>

      <FlatList
        data={filteredCategories}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={{gap: 16}}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderRadius: 8,
                backgroundColor: applyOpacityToHexColor(
                  buttonBackgroundColor,
                  25,
                ),
              }}>
              <View
                style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
                <View>
                  <Text style={{textTransform: 'capitalize'}} variant="h3">
                    {item.name}
                  </Text>
                  {selectedTransactionType.value === 'EXPENSE' && (
                    <Text style={{textTransform: 'capitalize'}}>
                      {item.transactionCategory}
                    </Text>
                  )}
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 24}}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(item);
                    setAddNewModalVisible(true);
                  }}>
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    showAlertDialog({
                      title: 'Delete Category',
                      message: `Are you sure you want to delete ${item.name} category?`,
                      positiveButtonTitle: 'Yes',
                      negativeButtonTitle: 'No',
                      onPositiveButtonPress: () => {
                        realm.write(() => {
                          item.isActive = false;
                        });
                      },
                    });
                  }}>
                  <Text>🔥</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {addNewModalVisible && (
        <AddTypeInputModal
          visible={addNewModalVisible}
          setVisible={setAddNewModalVisible}
          type={selectedTransactionType.value}
          handleAddNewCategory={handleAddNewCategory}
          category={selectedCategory}
        />
      )}
    </View>
  );
};

export default ManageCategories;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(245, 252, 255, 1)',
  },
});
