import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Budget, Expense} from '../../realm/models/Account';
import {ExpenseType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';

const AddBudget = ({month, year, budgets = []}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const EXPENSE_TYPES = useQuery(ExpenseType, type => {
    return type.sorted('name');
  });
  const filteredExpenseTypes = EXPENSE_TYPES.filtered('isActive = true');

  const addBudget = () => {
    try {
      realm.write(() => {
        realm.create(Budget, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: 'budget', // 'budget' is a string,
          for: `${month}/${year}`,
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
      {!!budgets?.length && (
        <View>
          <Text>Budget</Text>
          {budgets.map(budget => {
            return (
              <View key={budget._id} style={{flexDirection: 'row'}}>
                <Text>{budget.value}</Text>
                <Text> {budget.type?.name}</Text>
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
          <Button title={'+'} onPress={addBudget}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddBudget;
