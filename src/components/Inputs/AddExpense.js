import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Expense} from '../../realm/models/Account';
import {ExpenseType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';
import TypeCard from '../cards/TypeCard';
import {alertError} from '../../utils/alertError';

const AddExpense = ({expenses = [], date}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

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
      if (!Number(value)) return alertError('Please enter a number value');
      if (!type) return alertError('Please select a type');

      const expenseType = getExpenseType();

      realm.write(() => {
        realm.create(Expense, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: expenseType,
          addedOn: date,
          notes: notes,
        });
      });
      setValue('');
      setType('');
      setNotes('');
    } catch (e) {
      alertError(e);
    }
  };

  const onDeleteExpense = expense => {
    try {
      realm.write(() => {
        realm.delete(expense);
      });
    } catch (e) {}
  };

  return (
    <View>
      {!!expenses?.length && (
        <View>
          <Text>Expenses</Text>
          {expenses.map(expense => {
            return (
              <TypeCard
                item={expense}
                type={expense.type}
                key={expense._id}
                onDelete={() => onDeleteExpense(expense)}
              />
            );
          })}
        </View>
      )}

      <Text>Add Expense</Text>
      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <View>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
            keyboardType={'numeric'}
          />
        </View>
        <View
          style={{
            marginVertical: 10,
            borderWidth: 1,
            padding: 2,
          }}>
          <TypeInputDropdown
            items={filteredExpenseTypes}
            type={'expense'}
            setType={setType}
            value={type}
          />
        </View>
        <View>
          <InputBox
            placeholder={'Enter Notes (optional)'}
            inputValue={notes}
            setInputValue={setNotes}
          />
        </View>
        <View style={{flex: 1, marginTop: 10}}>
          <Button title={'+ Add Expense'} onPress={addExpense}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddExpense;
