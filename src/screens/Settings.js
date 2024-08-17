import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Button from '../components/common/Button';
import {exportRealmData} from '../utils/realm-import-export';
import {Dropdown} from 'react-native-element-dropdown';
import {Category} from '../realm/models/Account';
import {useQuery, useRealm} from '@realm/react';

export default function Settings() {
  const realm = useRealm();

  const EXPENSE_TYPES = useQuery(Category)
    .filtered('type == "EXPENSE"')
    .sorted('transactionCategory');
  const filteredExpenseTypes = EXPENSE_TYPES;

  const onSelectItem = (expenseId, category) => {
    try {
      realm.write(() => {
        const expenseType = realm.objectForPrimaryKey('Category', expenseId);
        expenseType.transactionCategory = category;
      });
    } catch (error) {}
  };

  return (
    <View style={{paddingHorizontal: 16, flex: 1, gap: 16}}>
      <View style={{flex: 1, gap: 16}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text>Set Category to expenses types</Text>
        </View>

        <FlatList
          data={filteredExpenseTypes}
          contentContainerStyle={{gap: 16}}
          renderItem={({item, index}) => {
            return (
              <View
                style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                <Text>{index + 1}.</Text>
                <Text>{item.name}</Text>
                <Dropdown
                  style={{flex: 1}}
                  labelField={'name'}
                  valueField={'value'}
                  value={{
                    name: item?.transactionCategory?.toLowerCase(),
                    value: item?.transactionCategory,
                  }}
                  data={[
                    {name: 'Need', value: 'NEED'},
                    {name: 'Want', value: 'WANT'},
                    {name: 'Savings', value: 'SAVINGS'},
                  ]}
                  renderItem={category => {
                    return (
                      <View
                        key={category.name}
                        style={({pressed}) => [
                          {
                            backgroundColor: pressed
                              ? 'rgba(0, 0, 0, 0.1)'
                              : 'white',
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
                    onSelectItem(item._id, category.value);
                  }}></Dropdown>
              </View>
            );
          }}
          keyExtractor={item => item.name}></FlatList>
      </View>
      {/* <Button
        style={{marginVertical: 16}}
        title="Delete App data"
        onPress={() => {
          realm.write(() => {
            realm.deleteAll();
          });
        }}
      /> */}
      <Button
        style={{marginVertical: 16}}
        title="Export App data"
        onPress={() => {
          exportRealmData(realm);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
