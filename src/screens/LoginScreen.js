import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Keyboard, Alert} from 'react-native';
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import {useObject, useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Profile} from '../realm/models';
import {ExpenseType} from '../realm/models/User';
import AddAsset from '../components/Inputs/AddAsset';

const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const realm = useRealm();
  const [error, setError] = useState('');
  const expenseTypes = useQuery(ExpenseType);

  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: 'row', marginHorizontal: 10, marginBottom: 16}}>
        <InputBox
          label={'Name'}
          type="alphaNumeric"
          placeholder={'Enter your name'}
          error={error}
          setError={setError}
          inputValue={name}
          setInputValue={setName}
        />
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button title={'Enter'} onPress={() => {}} disabled={!!error}></Button>
      </View>
      <View style={{marginHorizontal: 10}}>
        <AddAsset />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default LoginScreen;
