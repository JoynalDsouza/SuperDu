import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useState} from 'react';
import {useRealm} from '@realm/react';
import {alertError} from '../../utils/alertError';

const AddTypeInputModal = ({
  visible,
  setType = () => {},
  setVisible = () => {},
  type = '',
}) => {
  const [value, setValue] = useState('');

  const realm = useRealm();

  const addType = schemaName => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          schemaName,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          if (!typeExsits?.isActive) {
            realm.write(() => {
              realm.create(
                schemaName,
                {
                  name: typeExsits.name,
                  isActive: true,
                },
                'modified',
              );
            });
          }
          setType(typeExsits.name);
        } else {
          let newType;
          realm.write(() => {
            newType = realm.create(schemaName, {
              name: value?.toLowerCase(),
              isActive: true,
            });
          });
          setType(newType.name);
        }
      }
    } catch (e) {
      alertError(e);
    }
  };

  const onAddPress = () => {
    if (value) {
      switch (type) {
        case 'expense':
          addType('ExpenseType');
          break;
        case 'income':
          addType('IncomeType');
          break;
        case 'investment':
          addType('InvestmentType');
          break;
        case 'lending':
          addType('LendingType');
          break;
        default:
          setVisible(false);

          break;
      }
      setValue('');
      setVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{marginBottom: 10}}>Add {type} type</Text>

          <InputBox
            placeholder={`Enter new ${type} type here`}
            inputValue={value}
            setInputValue={setValue}
          />

          <Button title={'+'} style={{marginTop: 10}} onPress={onAddPress} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddTypeInputModal;
