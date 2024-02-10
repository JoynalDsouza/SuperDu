import {Alert, Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import InputBox from '../common/InputBox';
import Button from '../common/Button';
import {useState} from 'react';
import {
  ExpenseType,
  IncomeType,
  InvestmentType,
  LendingType,
} from '../../realm/models/User';
import {useRealm} from '@realm/react';

const AddTypeInputModal = ({
  visible,
  setType = () => {},
  setVisible = () => {},
  type = '',
}) => {
  const [value, setValue] = useState('');

  const realm = useRealm();

  const addExpenseType = () => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          ExpenseType,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          if (!typeExsits?.isActive) {
            realm.write(() => {
              realm.create(
                ExpenseType,
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
          let newExpenseType;
          realm.write(() => {
            newExpenseType = realm.create(ExpenseType, {
              name: value?.toLowerCase(),
            });
          });
          setType(newExpenseType.name);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addIncomeType = () => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          IncomeType,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          if (!typeExsits?.isActive) {
            realm.create(
              IncomeType,
              {
                name: typeExsits.name,
                isActive: true,
              },
              'modified',
            );
          }
          setType(typeExsits.name);
        } else {
          let newIncomeType;
          realm.write(() => {
            newIncomeType = realm.create(IncomeType, {
              name: value?.toLowerCase(),
            });
          });
          setType(newIncomeType.name);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addInvestmentType = () => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          InvestmentType,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          if (!typeExsits?.isActive) {
            realm.create(
              InvestmentType,
              {
                name: typeExsits.name,
                isActive: true,
              },
              'modified',
            );
          }
          setType(typeExsits.name);
        } else {
          let newInvestmentType;
          realm.write(() => {
            newInvestmentType = realm.create(InvestmentType, {
              name: value?.toLowerCase(),
            });
          });
          setType(newInvestmentType.name);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addLendingType = () => {
    try {
      if (value) {
        const typeExsits = realm.objectForPrimaryKey(
          LendingType,
          value?.toLowerCase(),
        );
        if (typeExsits?.name) {
          if (!typeExsits?.isActive) {
            realm.create(
              LendingType,
              {
                name: typeExsits.name,
                isActive: true,
              },
              'modified',
            );
          }
          setType(typeExsits.name);
        } else {
          let newLendingType;
          realm.write(() => {
            newLendingType = realm.create(LendingType, {
              name: value?.toLowerCase(),
            });
          });
          setType(newLendingType.name);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onAddPress = () => {
    if (value) {
      switch (type) {
        case 'expense':
          addExpenseType();
          break;
        case 'income':
          addIncomeType();
          break;
        case 'investment':
          addInvestmentType();
          break;
        case 'lending':
          addLendingType();
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
