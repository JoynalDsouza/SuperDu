import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Budget, Expense} from '../../realm/models/Account';
import {ExpenseType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';
import {alertError} from '../../utils/alertError';

const AddBudget = ({
  date,
  budgets = [],
  setCounter = () => {},
  counter = 0,
}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const EXPENSE_TYPES = useQuery(ExpenseType, type => {
    return type.sorted('name');
  });
  const filteredExpenseTypes = EXPENSE_TYPES.filtered('isActive = true');

  const addBudget = () => {
    try {
      if (!Number(value)) return alertError('Please enter a number value');
      if (!type) return alertError('Please select a type');
      const budgetExists = realm.objectForPrimaryKey(Budget, date);
      if (!budgetExists) {
        realm.write(() => {
          realm.create(Budget, {
            for: date,
            budget: [{value: Number(value), type: type}],
          });
        });
      } else {
        const budgets = budgetExists.budget;
        const typeExists = budgets.find(budget => budget.type === type);
        if (typeExists) {
          realm.write(() => {
            typeExists.value = typeExists.value + Number(value);
          });
        } else {
          realm.write(() => {
            budgets.push({value: Number(value), type: type});
          });
        }
      }

      setValue('');
      setType('');
      setCounter(counter + 1);
    } catch (e) {
      alertError(e);
    }
  };

  return (
    <View>
      {!!budgets?.length && (
        <View>
          <Text>Budget</Text>
          {budgets.map(budget => {
            return (
              <View key={budget._id} style={{flexDirection: 'row'}}>
                <Text>{budget.value}</Text>
                <Text> {budget.type}</Text>
              </View>
            );
          })}
        </View>
      )}
      <Text>Add Budget</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
            keyboardType={'numeric'}
          />
        </View>
        <View style={{flex: 2, marginHorizontal: 10, zIndex: 10}}>
          <TypeInputDropdown
            items={[
              ...filteredExpenseTypes,
              {name: 'investment', value: 'investment'},
              {name: 'lending', value: 'lending'},
            ]}
            type={'budget'}
            setType={setType}
            value={type}
          />
        </View>
        <View style={{flex: 1}}>
          <Button title={'+'} onPress={addBudget}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddBudget;
