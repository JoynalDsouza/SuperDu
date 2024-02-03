import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Asset, Investment} from '../../realm/models/Account';
import {AssetType, InvestmentType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';

const AddInvestment = ({investments = [], date}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const INVESTMENT_TYPES = useQuery(InvestmentType, type => {
    return type.sorted('name');
  });
  const filteredInvestmentTypes = INVESTMENT_TYPES.filtered('isActive = true');

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
          addedOn: date,
        });
      });
      setValue('');
      setType('');
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteInvestment = investment => {
    try {
      realm.write(() => {
        realm.delete(investment);
      });
    } catch (e) {}
  };

  return (
    <View>
      {!!investments?.length && (
        <View>
          <Text>Investments</Text>
          {investments.map(investment => {
            return (
              <TypeCard
                item={investment}
                key={investment._id}
                type={investment.type}
                onDelete={onDeleteInvestment}></TypeCard>
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
          <TypeInputDropdown
            type="investment"
            items={filteredInvestmentTypes}
            setType={setType}
            value={type}
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
