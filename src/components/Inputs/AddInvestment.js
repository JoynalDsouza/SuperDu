import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Asset, Investment} from '../../realm/models/Account';
import {AssetType, InvestmentType} from '../../realm/models/User';
import {BSON} from 'realm';

const AddInvestment = ({investments = []}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const getInvestmentType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          InvestmentType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newInvestmentType;
          realm.write(() => {
            newInvestmentType = realm.create(InvestmentType, {
              name: type?.toLowerCase(),
            });
          });
          return newInvestmentType;
        }
      }
    } catch (e) {}
  };

  const addInvestment = () => {
    try {
      const investmentType = getInvestmentType();
      realm.write(() => {
        realm.create(Investment, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: investmentType,
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
      {!!investments?.length && (
        <View>
          <Text>Investments</Text>
          {investments.map(investment => {
            return (
              <View key={investment._id} style={{flexDirection: 'row'}}>
                <Text>{investment.value}</Text>
                <Text> {investment.type?.name}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text>Add Investment</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
          />
        </View>
        <View style={{flex: 2, marginHorizontal: 10}}>
          <InputBox
            placeholder={'Select Type'}
            inputValue={type}
            setInputValue={setType}
          />
        </View>
        <View style={{flex: 1}}>
          <Button title={'+'} onPress={addInvestment}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddInvestment;