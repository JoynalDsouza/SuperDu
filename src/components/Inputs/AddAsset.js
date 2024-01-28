import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Asset} from '../../realm/models/Account';
import {AssetType} from '../../realm/models/User';
import {BSON} from 'realm';

const AddAsset = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');

  const realm = useRealm();

  const myAssets = useQuery(Asset);

  const getAssetType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          AssetType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newAssetType;
          realm.write(() => {
            newAssetType = realm.create(AssetType, {
              name: type?.toLowerCase(),
            });
          });
          return newAssetType;
        }
      }
    } catch (e) {}
  };

  const addAsset = () => {
    try {
      const assetType = getAssetType();
      realm.write(() => {
        realm.create(Asset, {
          _id: new BSON.ObjectID(),
          value: Number(value),
          type: assetType,
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
      {!!myAssets?.length && (
        <View>
          <Text>My Assets</Text>
          {myAssets.map(asset => {
            return (
              <View key={asset._id} style={{flexDirection: 'row'}}>
                <Text>{asset.value}</Text>
                <Text>{asset.type?.name}</Text>
              </View>
            );
          })}
        </View>
      )}

      <Text>Add Assets</Text>
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
          <Button title={'+'} onPress={addAsset}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddAsset;
