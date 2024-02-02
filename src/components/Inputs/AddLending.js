import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Asset, Lending} from '../../realm/models/Account';
import {AssetType, LendingType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';

const AddLending = ({lendings = []}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const LENDING_TYPES = useQuery(LendingType, type => {
    return type.sorted('name');
  });
  const filteredLendingTypes = LENDING_TYPES.filtered('isActive = true');

  const getLendingType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          LendingType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newLendingType;
          realm.write(() => {
            newLendingType = realm.create(LendingType, {
              name: type?.toLowerCase(),
            });
          });
          return newLendingType;
        }
      }
    } catch (e) {}
  };

  const addLending = () => {
    try {
      const lendingType = getLendingType();
      realm.write(() => {
        realm.create(Lending, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: lendingType,
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
      {!!lendings?.length && (
        <View>
          <Text>Lendings</Text>
          {lendings.map(lending => {
            return (
              <View key={lending._id} style={{flexDirection: 'row'}}>
                <Text>{lending.value}</Text>
                <Text> {lending.type?.name}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text>Add Lending</Text>
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
            type="lending"
            items={filteredLendingTypes}
            setType={setType}
            value={type}
          />
        </View>
        <View style={{flex: 1}}>
          <Button title={'+'} onPress={addLending}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddLending;
