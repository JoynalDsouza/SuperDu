import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Keyboard} from 'react-native';
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Profile} from '../realm/models';

const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const realm = useRealm();
  const [error, setError] = useState('');

  const profile = useQuery(Profile);

  useEffect(() => {
    if (profile.length > 0) {
      navigation.navigate('Home', 'reset');
    }
  });

  const addProfile = () => {
    // Keyboard.dismiss();
    realm.write(() => {
      realm.create(Profile, {
        _id: new BSON.ObjectId(),
        name: name,
      });
    });
    navigation.navigate('Home', 'reset');
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
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

      <Button title={'Enter'} onPress={addProfile} disabled={!!error}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // fill the entire screen
    // backgroundColor: 'black',
  },
});

export default LoginScreen;
