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
import {Plan, Profile} from '../realm/models';
import {
  askAlarmPermission,
  askNotificationPermission,
  checkAlarmPermission,
} from '../utils/permission';

const getPlansByDay = (plans, day) => {
  return plans.filter(plan => {
    if (plan.isCompleted) return false;
    if (plan.deleted) return false;
    const {repeatType, repeatSequence, repeatEndDate} = plan;
    if (repeatEndDate && new Date(repeatEndDate) < new Date()) return false;
    if (repeatType === 'daily') {
      return true;
    } else if (repeatType === 'weekly') {
      return repeatSequence.includes(day - 1);
    }
  });
};

const HomeScreen = ({navigation}) => {
  const profile = useQuery(Profile);

  const Plans = useQuery(Plan);

  const todaysPlans = getPlansByDay(Plans, new Date().getDay());

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
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Today's Plans
            </Text>
          </View>
          <ScrollView>
            {todaysPlans.map(plan => {
              return (
                <TouchableOpacity
                  key={plan._id}
                  onPress={() => {
                    navigation.navigate('PlanDetail', {planId: plan._id});
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      margin: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text>{plan.title}</Text>
                    <Text>{plan.startTime}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

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
