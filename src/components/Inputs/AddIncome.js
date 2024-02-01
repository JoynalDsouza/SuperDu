import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Asset, Income} from '../../realm/models/Account';
import {AssetType, IncomeType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';

const AddIncome = ({incomes = []}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const INCOME_TYPES = useQuery(IncomeType, type => {
    return type.sorted('name');
  });
  const filteredIncomeTypes = INCOME_TYPES.filtered('isActive = true');

  const getIncomeType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          IncomeType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newIncomeType;
          realm.write(() => {
            newIncomeType = realm.create(IncomeType, {
              name: type?.toLowerCase(),
            });
          });
          return newIncomeType;
        }
      }
    } catch (e) {}
  };

  const addIncome = () => {
    try {
      const incomeType = getIncomeType();
      realm.write(() => {
        realm.create(Income, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: incomeType,
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
      {!!incomes?.length && (
        <View>
          <Text>Incomes</Text>
          {incomes.map(income => {
            return (
              <View key={income._id} style={{flexDirection: 'row'}}>
                <Text>{income.value}</Text>
                <Text> {income.type?.name}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text>Add Income</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
          />
        </View>
        <View style={{flex: 2, marginHorizontal: 10}}>
          <TypeInputDropdown
            type="income"
            items={filteredIncomeTypes}
            setType={setType}
          />
        </View>
        <View style={{flex: 1}}>
          <Button title={'+'} onPress={addIncome}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddIncome;
