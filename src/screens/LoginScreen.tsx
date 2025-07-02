import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InputBox from '../components/common/InputBox';
import Button from '../components/common/Button';
import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {rootNavigate} from '../Navigation/navigation';
import {importRealmData} from '../utils/realm-import-export';
import {User} from '../realm/models/User';
const LoginScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const realm = useRealm();
  const [error, setError] = useState('');

  const user = useQuery(User);

  const onNameEnter = () => {
    try {
      realm.write(() => {
        realm.create('User', {
          _id: new BSON.ObjectID(),
          name: name,
        });
      });
      onContinuePress();
    } catch (e) {}
  };

  const resetToDashboard = () => {
    rootNavigate('Home', 'reset');
  };

  const onContinuePress = () => {
    try {
      if (user?.length) {
        resetToDashboard();
      } else {
      }
    } catch (e) {}
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
              testID={'nameInput'}
              label={'Name'}
              type="alphaNumeric"
              placeholder={'Enter your name'}
              error={error}
              setError={setError}
              inputValue={name}
              setInputValue={setName}
            />
          </View>
          <View style={{alignSelf: 'center', gap: 16}}>
            <Button
              testID={'enterButton'}
              title={'Enter'}
              onPress={() => {
                onNameEnter();
              }}
              disabled={!!error}></Button>

            <Button
              title={'Import App Data'}
              onPress={() => {
                importRealmData(realm);
              }}
            />
          </View>
        </View>
      ) : (
        <View>
          <Text>Welcome {user[0]?.name}</Text>
          <Button title={"Let's Go!!!"} onPress={resetToDashboard}></Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default LoginScreen;
