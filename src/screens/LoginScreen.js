import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Keyboard, Alert} from 'react-native';
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import {useObject, useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Profile} from '../realm/models';
import {ExpenseType, User} from '../realm/models/User';
import AddAsset from '../components/Inputs/AddAsset';
import {rootNavigate} from '../Navigation/navigation';

const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const realm = useRealm();
  const [error, setError] = useState('');
  const expenseTypes = useQuery(ExpenseType);

  const user = useQuery(User) || {};

  const onNameEnter = () => {
    try {
      realm.write(() => {
        realm.create(User, {
          _id: new BSON.ObjectID(),
          name: name,
        });
      });
      onContinuePress();
    } catch (e) {
      console.log(e);
    }
  };

  const resetToDashboard = () => {
    rootNavigate('Home', 'reset');
  };

  const onContinuePress = () => {
    try {
      if (user?.length) {
        resetToDashboard();
      } else {
        // Alert.alert('Please enter your name');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    onContinuePress();
  }, []);

  return (
    <View style={styles.container}>
      {!user.length ? (
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginBottom: 16,
            }}>
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
            <Button
              title={'Enter'}
              onPress={() => {
                onNameEnter();
              }}
              disabled={!!error}></Button>
          </View>
        </View>
      ) : (
        <View>
          <Text>Welcome {user[0]?.name}</Text>
        </View>
      )}
      {/* <View style={{marginHorizontal: 10}}>
        <AddAsset />
      </View> */}
      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Button title={'Continue'} onPress={onContinuePress}></Button>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default LoginScreen;
