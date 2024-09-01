import {
  BackHandler,
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {BSON} from 'realm';
import Text from '../components/common/Text';
import {PRIMARY_BACKGROUND} from '../design/theme';
import Button from '../components/common/Button';
import {rootNavigate} from '../Navigation/navigation';
import {ManageTransactionParams} from 'Navigation/navigation.types';
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
import SelectChip from '../components/common/SelectChip';

const ManageTransaction = ({route}) => {
  const {transactionId}: ManageTransactionParams = route.params;

  const mode = transactionId ? 'edit' : 'add';

  const realm = useRealm();

  const currentDate = new Date();

  const [initialData, setInitialData] = useState({
    amount: '',
    notes: '',
    selectedTransactionType: '',
    selectedCategory: '',
    addedOn: currentDate,
  });

  const [addNewModalVisible, setAddNewModalVisible] = useState(false);

  const [date, setDate] = useState(currentDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const ALL_CATEGORIES = useQuery(Category).filtered('isActive == true');

  const transactionTypeDropdownData = TRANSACTION_TYPES;

  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionTypeDropdownData[0],
  );

  const filteredCategories = ALL_CATEGORIES.filtered(
    `type == "${selectedTransactionType.value}"`,
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const backAction = () => {
      if (showDatePicker) {
        setShowDatePicker(false);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [showDatePicker]);

  useEffect(() => {
    if (mode == 'edit') {
      const bsonTransactionId = new BSON.ObjectId(transactionId);
      const transaction = realm.objectForPrimaryKey(
        Transaction,
        bsonTransactionId,
      );
      if (transaction) {
        setInitialData({
          amount: transaction.amount.toString(),
          notes: transaction.notes,
          selectedTransactionType: transaction.type,
          selectedCategory: transaction.category._id?.toString(),
          addedOn: new Date(transaction.addedOn),
        });
        setDate(new Date(transaction.addedOn));
        setAmount(transaction.amount.toString());
        setNotes(transaction.notes);

        setSelectedTransactionType(
          transactionTypeDropdownData.find(
            item => item.value === transaction.type,
          ),
        );
        const category = ALL_CATEGORIES.find(
          item => item._id.toString() === transaction.category._id.toString(),
        );
        if (category) {
          setSelectedCategory(category);
        }
      }
    }
  }, []);

  const onAddTransaction = () => {
    try {
      let calculatedValue = amount;

      if (amount.startsWith('=')) {
        calculatedValue = eval(amount.slice(1));
        setAmount(calculatedValue);
      } else {
        if (!Number(amount)) return alertError('Please enter a number amount');
      }

      if (!selectedCategory) return alertError('Please select a category');

      const transactionData = {
        amount: Number(calculatedValue),
        type: selectedTransactionType.value,
        category: selectedCategory,
        modifiedOn: new Date(date),
        addedOn: new Date(date),
        notes,
      };

      realm.write(() => {
        if (mode === 'add') {
          realm.create('Transaction', {
            ...transactionData,
            _id: new BSON.ObjectId(),
          });
        } else {
          const bsonTransactionId = new BSON.ObjectId(transactionId);
          const transaction = realm.objectForPrimaryKey(
            Transaction,
            bsonTransactionId,
          );

          if (transaction) {
            Object.assign(transaction, transactionData);
          }
        }
      });

      resetForm();
      rootNavigate();
    } catch (e) {
      alertError(e);
    }
  };

  const resetForm = () => {
    setAmount('');
    setSelectedCategory(null);
    setNotes('');
  };

  const onDeleteTransaction = () => {
    try {
      const bsonTransactionId = new BSON.ObjectId(transactionId);
      const transaction = realm.objectForPrimaryKey(
        Transaction,
        bsonTransactionId,
      );

      realm.write(() => {
        realm.delete(transaction);
      });

      rootNavigate();
    } catch (error) {}
  };

  const handleSelectCategory = category => {
    try {
      if (category._id === 'NEW_CATEGORY') {
        setAddNewModalVisible(true);
      } else {
        setSelectedCategory(category);
      }
    } catch (error) {}
  };

  const handleAddNewCategory = ({value, categoryType}) => {
    try {
      const checkCategoryExists = filteredCategories.find(
        item => item.name.toLowerCase() === value.toLowerCase(),
      );
      if (checkCategoryExists) {
        if (!checkCategoryExists.isActive) {
          realm.write(() => {
            checkCategoryExists.isActive = true;
            checkCategoryExists.transactionCategory = categoryType || '';
          });
        }
        setSelectedCategory(checkCategoryExists);
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

        const category = realm.objectForPrimaryKey(Category, _id);

        setSelectedCategory(category);
      }

      setAddNewModalVisible(false);
    } catch (error) {}
  };

  const isEdited = useMemo(() => {
    return (
      amount !== initialData.amount ||
      notes !== initialData.notes ||
      selectedCategory?._id?.toString() !== initialData.selectedCategory ||
      selectedTransactionType.value !== initialData.selectedTransactionType ||
      date.getTime() != initialData.addedOn?.getTime()
    );
  }, [
    amount,
    notes,
    selectedCategory,
    selectedTransactionType,
    date,
    initialData,
  ]);

  const isSaveDisabled = !amount || !selectedCategory || !isEdited;

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
        title={mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}
        rightIcons={
          mode === 'edit' && [
            {
              icon: '❌',
              onPress: () => {
                showAlertDialog({
                  title: 'Delete Transaction',
                  message: 'Are you sure you want to delete this transaction?',
                  positiveButtonTitle: 'Yes',
                  negativeButtonTitle: 'No',
                  onPositiveButtonPress: () => {
                    onDeleteTransaction();
                  },
                });
              },
            },
          ]
        }
      />

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>{getDate(date)}</Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'column', gap: 8}}>
        <Text>Transaction Type : </Text>

        <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
          {transactionTypeDropdownData.map(item => {
            return (
              <SelectChip
                title={item.name}
                isSelected={selectedTransactionType.value === item.value}
                onPress={() => {
                  setSelectedTransactionType(item);
                  setSelectedCategory(null);
                }}
              />
            );
          })}
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Text>Amount :</Text>
        <View style={{flex: 1}}>
          <InputBox
            placeholder={'Enter amount'}
            inputValue={amount}
            setInputValue={setAmount}
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            style={{color: 'white'}}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Text>Category : </Text>
        <Dropdown
          style={{
            flex: 1,
          }}
          placeholderStyle={{
            color: 'rgba(255,255,255,0.5)',
          }}
          labelField={'name'}
          valueField={'_id'}
          selectedTextStyle={{
            color: 'white',
            textTransform: 'capitalize',
          }}
          value={selectedCategory}
          data={[
            {name: '+ Add New', _id: 'NEW_CATEGORY'},
            ...filteredCategories,
          ]}
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
                <Text style={{textTransform: 'capitalize'}}>
                  {category?.name}
                </Text>
              </View>
            );
          }}
          onChange={category => {
            handleSelectCategory(category);
          }}></Dropdown>
      </View>

      <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Text>Notes :</Text>
        <View style={{flex: 1}}>
          <InputBox
            placeholder={'Enter Notes (optional)'}
            inputValue={notes}
            setInputValue={setNotes}
            placeholderTextColor={'rgba(255,255,255,0.5)'}
            style={{color: 'white'}}
          />
        </View>
      </View>

      <Button
        backgroundColor={buttonBackgroundColor}
        title={
          mode === 'add'
            ? `ADD ${selectedTransactionType.value}`
            : `SAVE ${selectedTransactionType.value}`
        }
        disabled={isSaveDisabled}
        onPress={() => {
          onAddTransaction();
        }}
      />

      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <DateTimePicker
            mode="single"
            date={date}
            onChange={params => {
              try {
                // @ts-ignore
                const date = new Date(params.date?.toDate());

                setDate(date);

                setShowDatePicker(false);
              } catch (e) {
                alertError(e);
              }
            }}
          />
        </View>
      )}

      <AddTypeInputModal
        visible={addNewModalVisible}
        setVisible={setAddNewModalVisible}
        type={selectedTransactionType.value}
        handleAddNewCategory={handleAddNewCategory}
      />
    </View>
  );
};

export default ManageTransaction;

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
