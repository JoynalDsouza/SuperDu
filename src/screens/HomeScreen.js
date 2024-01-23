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
import notifee from '@notifee/react-native';

const getPlansByDay = (plans, day) => {
  const currentDay = day % 7; // Ensure day is within 0 to 6 (Sunday to Saturday)

  return plans.filter(plan => {
    if (plan.isCompleted || plan.deleted) {
      return false;
    }

    const {repeatType, repeatSequence, repeatEndDate} = plan;

    if (repeatEndDate && new Date(repeatEndDate) < new Date()) {
      return false;
    }

    if (repeatType === 'daily') {
      return true;
    } else if (repeatType === 'weekly') {
      return repeatSequence.includes(currentDay);
    }

    return false; // Handle other repeat types if needed
  });
};

const HomeScreen = ({navigation}) => {
  const profile = useQuery(Profile);

  const Plans = useQuery(Plan);

  const todaysPlans = getPlansByDay(Plans, new Date().getDay());
  const {name} = profile[0];

  useEffect(() => {
    const permissions = async () => {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
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
                    navigation.navigate('PlanDetail', {
                      plan: {...plan, _id: 'inex'},
                    });
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
