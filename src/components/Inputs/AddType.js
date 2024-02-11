import React, {useState} from 'react';
import {View, Text} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useQuery, useRealm} from '@realm/react';
import {Expense} from '../../realm/models/Account';
import {ExpenseType} from '../../realm/models/User';
import {BSON} from 'realm';
import TypeInputDropdown from './TypeInputDropdown';
import TypeCard from '../cards/TypeCard';
import {alertError} from '../../utils/alertError';

const AddType = ({modelType, model, title, date}) => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');

  const realm = useRealm();

  const TYPES = useQuery(modelType, type => {
    return type.sorted('name');
  });
  const filteredTypes = TYPES.filtered('isActive = true');

  const getType = () => {
    try {
      if (type) {
        const typeExsits = realm.objectForPrimaryKey(
          modelType,
          type?.toLowerCase(),
        );
        if (typeExsits?.name) {
          return typeExsits;
        } else {
          let newType;
          realm.write(() => {
            newType = realm.create(modelType, {
              name: type?.toLowerCase(),
            });
          });
          return newType;
        }
      }
    } catch (e) {}
  };

  const onAdd = () => {
    try {
      console.log('modelType', modelType, type);
      // if (!Number(value)) return alertError('Please enter a number value');
      let calculatedValue = value;
      if (!type) return alertError('Please select a type');

      if (value.startsWith('=')) {
        calculatedValue = eval(value.slice(1));
        setValue(calculatedValue);
      } else {
        if (!Number(value)) return alertError('Please enter a number value');
      }

      const type = getType();

      realm.write(() => {
        realm.create(model, {
          _id: new BSON.ObjectID(),
          value: Number(calculatedValue),
          type: type,
          addedOn: date,
          notes: notes,
        });
      });
      setValue('');
      setType('');
      setNotes('');
    } catch (e) {
      alertError(e);
    }
  };

  return (
    <View>
      <Text>{`Add ${title}`}</Text>
      <View style={{marginHorizontal: 20, marginVertical: 10}}>
        <View>
          <InputBox
            placeholder={'Enter value'}
            inputValue={value}
            setInputValue={setValue}
          />
        </View>
        <View
          style={{
            marginVertical: 10,
            borderWidth: 1,
            padding: 2,
          }}>
          <TypeInputDropdown
            items={filteredTypes}
            type={title.toLowerCase()}
            setType={setType}
            value={type}
          />
        </View>
        <View>
          <InputBox
            placeholder={'Enter Notes (optional)'}
            inputValue={notes}
            setInputValue={setNotes}
          />
        </View>
        <View style={{flex: 1, marginTop: 10}}>
          <Button title={`+ Add ${title}`} onPress={onAdd}></Button>
        </View>
      </View>
    </View>
  );
};

export default AddType;
