import {FlatList, StyleSheet, Text, View} from 'react-native';
import {formatToINR} from '../../utils/formatCurrency';

const BudgetTable = ({budgetData, containerStyles = {}}) => {
  const data = Object.keys(budgetData || {});
  const totalPlanned = data.reduce((acc, item) => {
    return acc + budgetData[item].planned;
  }, 0);
  const totalActual = data.reduce((acc, item) => {
    return acc + budgetData[item].actual;
  }, 0);
  const diff = totalPlanned - totalActual;
  return (
    <View style={containerStyles}>
      <View
        style={{
          borderWidth: 1,
          flex: 1,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.headerItems}>Type</Text>
          <Text style={styles.headerItems}>Planned</Text>
          <Text style={styles.headerItems}>Actual</Text>
          <Text style={styles.headerItems}>Diff</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.headerItems}></Text>
          <Text style={styles.headerItems}>{formatToINR(totalPlanned)}</Text>
          <Text style={styles.headerItems}>{formatToINR(totalActual)}</Text>
          <Text
            style={[styles.headerItems, {color: diff < 0 ? 'red' : 'green'}]}>
            {formatToINR(totalPlanned - totalActual)}
          </Text>
        </View>
      </View>
      <View>
        <FlatList
          data={data}
          keyExtractor={item => item}
          renderItem={({item}) => {
            const budgetItem = budgetData[item];
            const diff = budgetItem.planned - budgetItem.actual;
            if (!budgetItem.planned && !budgetItem.actual) {
              return null;
            }
            return (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  borderColor: 'black',
                }}>
                <Text style={styles.container}>{item}</Text>
                <Text style={styles.container}>
                  {formatToINR(budgetItem.planned)}
                </Text>
                <Text style={styles.container}>
                  {formatToINR(budgetItem.actual)}
                </Text>
                <Text
                  style={[
                    styles.container,
                    {color: diff < 0 ? 'red' : 'green'},
                  ]}>
                  {formatToINR(diff)}
                </Text>
              </View>
            );
          }}></FlatList>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    textAlign: 'center',
    paddingVertical: 4,
  },
  headerItems: {
    flex: 1,
    textAlign: 'center',
  },
});

export default BudgetTable;
