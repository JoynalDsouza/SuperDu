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
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
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
        const adjustedDate = new Date(date.getTime() + utcOffset * 60000);

        if (currentPicker === 'startTime') {
          setStartTime(adjustedDate);
        } else {
          setEndTime(adjustedDate);
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
    if (!title) {
      Alert.alert('Please enter a title');
      return;
    }
    if (startTime > endTime) {
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
      title: title,
      startTime: startTime,
      endTime: endTime,
      repeatSequence: repeatSequence,
      repeatType: repeatSequence?.length === 7 ? 'daily' : 'weeky',
      repeatEndDate: sequenceEndDate,
      description: description,
      isCompleted: false,
      goals: goals,
      friends: friends,
    };
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
              title={startTime?.toISOString()}
              onPress={() => showTimepicker('startTime')}
              style={{marginBottom: 10}}></Button>

            <Text>Set End Time</Text>
            <Button
              title={endTime?.toISOString()}
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
              value={currentPicker === 'startTime' ? startTime : endTime}
              mode={mode}
              is24Hour={false}
              onChange={onTimePickerChange}
              timeZoneName="Asia/Calcutta"
            />
          )}
        </ScrollView>
      </View>
      <Button title={'Create'}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill the entire screen
  },
});

export default CreatePlan;
