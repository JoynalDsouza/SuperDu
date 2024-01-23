import {useQuery} from '@realm/react';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {Profile} from '../realm/models';
import {
  askAlarmPermission,
  askNotificationPermission,
  checkAlarmPermission,
} from '../utils/permission';

const HomeScreen = ({navigation}) => {
  const profile = useQuery(Profile);

  const {name} = profile[0];

  useEffect(() => {
    const permissions = async () => {
      await askNotificationPermission();
      await checkAlarmPermission();
    };
    permissions();
  }, []);

  const onCreatePlan = () => {
    navigation.navigate('CreatePlan');
  };

  return (
    <>
      <View style={styles.container}>
        <Text>Hello {name}</Text>
        <View style={{flex: 1, backgroundColor: 'green'}}></View>

        <Button title="Create a study plan" onPress={onCreatePlan}></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the entire screen
  },
});

export default HomeScreen;
