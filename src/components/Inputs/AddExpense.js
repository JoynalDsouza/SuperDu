import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Expense} from '../../realm/models/Account';
import {ExpenseType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';

const AddExpense = ({expenses = [], date}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const EXPENSE_TYPES = useQuery(ExpenseType, type => {
    return type.sorted('name');
  });
  const filteredExpenseTypes = EXPENSE_TYPES.filtered('isActive = true');

  const getExpenseType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          ExpenseType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newExpenseType;
          realm.write(() => {
            newExpenseType = realm.create(ExpenseType, {
              name: type?.toLowerCase(),
            });
          });
          return newExpenseType;
        }
      }
    } catch (e) {}
  };

  const addExpense = () => {
    try {
      const expenseType = getExpenseType();
      realm.write(() => {
        realm.create(Expense, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: expenseType,
          addedOn: date,
        });
      });
      setValue('');
      setType('');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      {!!expenses?.length && (
        <View>
          <Text>Expenses</Text>
          {expenses.map(expense => {
            return (
              <View key={expense._id} style={{flexDirection: 'row'}}>
                <Text>{expense.value}</Text>
                <Text> {expense.type?.name}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text>Add Expense</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
          />
        </View>
        <View style={{flex: 2, marginHorizontal: 10, zIndex: 10}}>
          <TypeInputDropdown
            items={filteredExpenseTypes}
            type={'expense'}
            setType={setType}
            value={type}
          />
        </View>
        <View style={{flex: 1}}>
          <Button title={'+'} onPress={addExpense}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddExpense;
