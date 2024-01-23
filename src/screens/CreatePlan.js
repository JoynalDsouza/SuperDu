import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Button from '../components/common/Button';
import InputBox from '../components/common/InputBox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRealm} from '@realm/react';
import Plan from '../realm/models/Plan';
import {BSON} from 'realm';
import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

async function onCreateTriggerNotification(time, plan) {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: 'Plan Reminder : ' + plan.title,
      body: `Your plan is about to start at ${getAMPMTime(time)}`,
      android: {
        channelId: 'default',
      },
    },
    trigger,
  );
}

export const getAMPMTime = time => {
  if (!time) return time;
  const [hours, minutes] = time.split(':');
  const hoursInNumber = parseInt(hours);
  const minutesInNumber = parseInt(minutes);
  if (hoursInNumber > 12) {
    return `${hoursInNumber - 12}:${minutesInNumber} PM`;
  } else {
    return `${hoursInNumber}:${minutesInNumber} AM`;
  }
};

const compareStartTimeEndTime = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');
  const startHoursInNumber = parseInt(startHours);
  const startMinutesInNumber = parseInt(startMinutes);
  const endHoursInNumber = parseInt(endHours);
  const endMinutesInNumber = parseInt(endMinutes);
  if (startHoursInNumber > endHoursInNumber) {
    return false;
  } else if (startHoursInNumber === endHoursInNumber) {
    if (startMinutesInNumber > endMinutesInNumber) {
      return false;
    }
  }
  return true;
};

const WeekDays = ({repeatSequence, setRepeatSequence}) => {
  const days = [
    {
      name: 'M',
      index: 1,
      value: 'Monday',
    },
    {
      name: 'T',
      index: 2,
      value: 'Tuesday',
    },
    {
      name: 'W',
      index: 3,
      value: 'Wednesday',
    },
    {
      name: 'T',
      index: 4,
      value: 'Thrusday',
    },
    {
      name: 'F',
      index: 5,
      value: 'Friday',
    },
    {
      name: 'S',
      index: 6,
      value: 'Saturday',
    },
    {
      name: 'T',
      index: 7,
      value: 'Sunday',
    },
  ];

  return (
    <View style={{flexDirection: 'row'}}>
      {days.map(day => {
        const isSelected = repeatSequence.includes(day.index);
        const backgroundColor = isSelected ? 'grey' : 'white';

        const onPress = () => {
          if (isSelected) {
            const index = repeatSequence.indexOf(day.index);
            repeatSequence.splice(index, 1);
            setRepeatSequence([...repeatSequence]);
          } else {
            setRepeatSequence([...repeatSequence, day.index]);
          }
        };

        return (
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={onPress}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: backgroundColor,
                borderWidth: 1,
              }}>
              <Text>{day.name}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  // <View></View>
};

const CreatePlan = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentPicker, setCurrentPicker] = useState('startTime');

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [repeatSequence, setRepeatSequence] = useState([]);

  const [sequenceEndDate, setSequenceEndDate] = useState(null);

  const [friends, setFriends] = useState('');
  const [description, setDescription] = useState('');

  const [goals, setGoals] = useState([
    {
      value: '',
      isCompleted: false,
    },
  ]);

  const realm = useRealm();

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = type => {
    setCurrentPicker(type);
    showMode('time');
  };

  const onTimePickerChange = (event, selectedDate) => {
    try {
      if (mode == 'time') {
        const timestamp = event.nativeEvent.timestamp;
        const utcOffset = event.nativeEvent.utcOffset;
        const date = new Date(timestamp);
        const adjustedDate = new Date(date.getTime());
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes();
        if (currentPicker === 'startTime') {
          setStartTime(`${hours}:${minutes}`);
        } else {
          setEndTime(`${hours}:${minutes}`);
        }
      } else {
        setSequenceEndDate(selectedDate);
      }
      setShow(false);
    } catch (e) {
      console.log(e);
    }
  };

  const createPlan = () => {
    try {
      if (!title) {
        Alert.alert('Please enter a title');
        return;
      }
      if (!startTime) {
        Alert.alert('Please enter a start time');
        return;
      }
      if (!endTime) {
        Alert.alert('Please enter a end time');
        return;
      }

      if (!compareStartTimeEndTime(startTime, endTime)) {
        Alert.alert('Start time should be less than end time');
        return;
      }

      if (repeatSequence.length && sequenceEndDate) {
        if (sequenceEndDate < startTime) {
          Alert.alert('End date should be greater than start time');
          return;
        }
      }

      const obj = {
        _id: new BSON.ObjectId(),
        title: title,
        startTime: startTime,
        endTime: endTime,
        repeatSequence: repeatSequence || [],
        repeatType: repeatSequence?.length === 7 ? 'daily' : 'weekly',
        repeatEndDate:
          repeatSequence?.length === 0
            ? new Date().toISOString()
            : sequenceEndDate?.toISOString() || '',
        description: description,
        isCompleted: false,
        goals: goals,
        friends: friends?.split(','),
      };

      realm.write(() => {
        realm.create(Plan, obj);
      });
      onCreateTriggerNotification(startTime, obj);
      navigation.navigate('Home', 'reset');
    } catch (e) {
      navigation.navigate('Home', 'reset');
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'green',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Create Plan
        </Text>
      </View>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{marginHorizontal: 6}}>
          <InputBox
            label={'title'}
            inputValue={title}
            type="alphaNumeric"
            setInputValue={setTitle}></InputBox>

          <View>
            <Text>Set Start Time</Text>
            <Button
              title={getAMPMTime(startTime) || 'set start time'}
              onPress={() => showTimepicker('startTime')}
              style={{marginBottom: 10}}></Button>

            <Text>Set End Time</Text>
            <Button
              title={getAMPMTime(endTime) || 'set end time'}
              onPress={() => showTimepicker('endTime')}></Button>
          </View>

          <View>
            {!!!repeatSequence.length ? (
              <Text>Today</Text>
            ) : (
              <View>
                <Text>Set End Date</Text>
                <Button
                  onPress={() => showMode('date')}
                  title={
                    sequenceEndDate?.toISOString() || 'Always Repeat'
                  }></Button>
              </View>
            )}
          </View>

          <View style={{marginVertical: 8}}>
            <WeekDays
              repeatSequence={repeatSequence}
              setRepeatSequence={setRepeatSequence}
            />
          </View>

          <InputBox
            label={'Description'}
            inputValue={description}
            setInputValue={setDescription}
          />

          <InputBox
            label={'Friends'}
            inputValue={friends}
            setInputValue={setFriends}></InputBox>

          <Text>Add Goals</Text>
          <View>
            {goals.map((goal, index) => {
              const setGoalsArray = value => {
                const newGoals = [...goals];
                newGoals[index].value = value;
                setGoals(newGoals);
              };
              return (
                <InputBox
                  key={index}
                  inputValue={goal.value}
                  type="alphaNumeric"
                  setInputValue={setGoalsArray}></InputBox>
              );
            })}
          </View>
          {goals.length < 5 && (
            <Button
              title={'Add More Goals'}
              onPress={() => {
                if (goals.length < 5) {
                  setGoals([...goals, {value: '', isCompleted: false}]);
                }
              }}></Button>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode={mode}
              is24Hour={false}
              onChange={onTimePickerChange}
              timeZoneName="Asia/Calcutta"
            />
          )}
        </ScrollView>
      </View>
      <Button title={'Create'} onPress={createPlan}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the entire screen
  },
});

export default CreatePlan;
