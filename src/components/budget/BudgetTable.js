import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {formatToINR} from '../../utils/formatCurrency';

const BudgetTable = ({budgetData, containerStyles = {}}) => {
  const data = Object.keys(budgetData || {});
  const totalPlanned = data.reduce(
    (acc, item) => acc + budgetData[item].planned,
    0,
  );
  const totalActual = data.reduce(
    (acc, item) => acc + budgetData[item].actual,
    0,
  );
  const diff = totalPlanned - totalActual;

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.table}>
        <View style={[styles.headerRow, styles.rowSeparator]}>
          <Text style={styles.headerItem}>Type</Text>
          <Text style={styles.headerItem}>Planned</Text>
          <Text style={styles.headerItem}>Actual</Text>
          <Text style={styles.headerItem}>Diff</Text>
        </View>
        <View style={[styles.summaryRow, styles.rowSeparator]}>
          <Text style={styles.dataItem}></Text>
          <Text style={styles.dataItem}>{formatToINR(totalPlanned)}</Text>
          <Text style={styles.dataItem}>{formatToINR(totalActual)}</Text>
          <Text style={[styles.dataItem, {color: diff < 0 ? 'red' : 'green'}]}>
            {formatToINR(diff)}
          </Text>
        </View>
      </View>
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
            <View style={[styles.dataRow, styles.rowSeparator]}>
              <Text style={[styles.dataItem, styles.capitalize]}>{item}</Text>
              <Text style={styles.dataItem}>
                {formatToINR(budgetItem.planned)}
              </Text>
              <Text style={styles.dataItem}>
                {formatToINR(budgetItem.actual)}
              </Text>
              <Text
                style={[styles.dataItem, {color: diff < 0 ? 'red' : 'green'}]}>
                {formatToINR(diff)}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
  },
  headerItem: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
  },
  dataRow: {
    flexDirection: 'row',
  },
  dataItem: {
    flex: 1,
    padding: 12,
    textAlign: 'center',
    fontSize: 13,
  },
  rowSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
});

export default BudgetTable;
