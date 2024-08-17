import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {BSON} from 'realm';
import Text from '../components/common/Text';
import {ERROR_RED, PRIMARY_BACKGROUND} from '../design/theme';
import Button from '../components/common/Button';
import {rootNavigate} from '../Navigation/navigation';
import {ManageTransactionParams} from 'Navigation/navigation.types';
import {Dropdown} from 'react-native-element-dropdown';
import InputBox from '../components/common/InputBox';
import {useQuery, useRealm} from '@realm/react';
import {Category, CategoryType, Transaction} from '../realm/models/Account';
import {alertError} from '../utils/alertError';

const ManageTransaction = ({route}) => {
  const {transactionId}: ManageTransactionParams = route.params;

  const mode = transactionId ? 'edit' : 'add';

  const realm = useRealm();

  const [initialData, setInitialData] = useState({
    amount: '',
    notes: '',
    selectedTransactionType: '',
    selectedCategory: '',
  });

  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const ALL_CATEGORIES = useQuery(Category).filtered('isActive == true');

  const transactionTypeDropdownData: {name: string; value: CategoryType}[] = [
    {name: 'Expense', value: 'EXPENSE'},
    {name: 'Income', value: 'INCOME'},
    {name: 'Lending', value: 'LENDING'},
    {name: 'Investment', value: 'INVESTMENT'},
  ];

  const [selectedTransactionType, setSelectedTransactionType] = useState(
    transactionTypeDropdownData[0],
  );

  const filteredCategories = ALL_CATEGORIES.filtered(
    `type == "${selectedTransactionType.value}"`,
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

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
        });

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
      if (!Number(amount)) return alertError('Please enter a number amount');
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
        modifiedOn: new Date(),
        notes,
      };

      realm.write(() => {
        if (mode === 'add') {
          realm.create('Transaction', {
            ...transactionData,
            _id: new BSON.ObjectId(),
            addedOn: new Date(),
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

  const isEdited = useMemo(() => {
    return (
      amount !== initialData.amount ||
      notes !== initialData.notes ||
      selectedCategory?._id?.toString() !== initialData.selectedCategory ||
      selectedTransactionType.value !== initialData.selectedTransactionType
    );
  }, [amount, notes, selectedCategory, selectedTransactionType, initialData]);

  const isSaveDisabled = !amount || !selectedCategory || !isEdited;

  return (
    <View
      style={{
        backgroundColor: PRIMARY_BACKGROUND,
        gap: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        flex: 1,
      }}>
      <View
        style={{
          marginVertical: 16,
          gap: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Pressable
          onPress={() => {
            rootNavigate();
          }}>
          <Text>{'<--'}</Text>
        </Pressable>
        <Text style={{textTransform: 'capitalize'}}>{mode} Transaction</Text>

        {mode == 'edit' && (
          <Pressable onPress={onDeleteTransaction}>
            <Text color={ERROR_RED}>X</Text>
          </Pressable>
        )}
      </View>
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
            setSelectedCategory(null);
          }}></Dropdown>
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
          }}
          value={selectedCategory}
          data={filteredCategories as any}
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
            setSelectedCategory(category);
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
        title={mode === 'add' ? 'Add Transaction' : 'Save Transaction'}
        disabled={isSaveDisabled}
        onPress={() => {
          onAddTransaction();
        }}
      />
    </View>
  );
};

export default ManageTransaction;

const styles = StyleSheet.create({});
