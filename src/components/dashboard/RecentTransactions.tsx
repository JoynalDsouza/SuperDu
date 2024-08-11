import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import Button from '../common/Button';
import Text from '../common/Text';
import {useQuery} from '@realm/react';
import {Expense, Income, Investment, Lending} from 'realm/models/Account';
import {LIGHT_SLATE_GREY} from '../../design/theme';
import TransactionCard from '../Transaction/TransactionCard';

// Define types for the queried objects
interface Transaction {
  _id: string;
  addedOn: Date;
  value: number;
  category: string;
}

const RecentTransactions = () => {
  // Fetch data from different collections
  const RecentExpenses = useQuery<Expense>('Expense')
    .sorted('addedOn', true)
    .slice(0, 5)
    .map(expense => {
      return {
        ...expense,
        type: 'Expense',
        category: expense.type.name,
      };
    });

  const RecentIncomes = useQuery<Income>('Income')
    .sorted('addedOn', true)
    .slice(0, 5)
    .map(income => {
      return {
        ...income,
        type: 'Income',
        category: income.type.name,
      };
    });

  const RecentLendings = useQuery<Lending>('Lending')
    .sorted('addedOn', true)
    .slice(0, 5)
    .map(lending => {
      return {
        ...lending,
        type: 'Lending',
        category: lending.type.name,
      };
    });

  const RecentInvestments = useQuery<Investment>('Investment')
    .sorted('addedOn', true)
    .slice(0, 5)
    .map(investment => {
      return {
        ...investment,
        type: 'Investment',
        category: investment?.type?.name,
      };
    });

  // Combine and sort recent transactions
  const RecentTransactions = [
    ...RecentExpenses,
    ...RecentIncomes,
    ...RecentLendings,
    ...RecentInvestments,
  ]
    .sort((a, b) => (a.addedOn > b.addedOn ? -1 : 1))
    .slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Recent Transactions</Text>
        <Button title="View All" type="link" onPress={() => {}} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={RecentTransactions}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => {
          const {type, category, addedOn, value} = item;
          return (
            <TransactionCard
              type={type}
              category={category}
              addedOn={addedOn}
              value={value}
            />
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default RecentTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  separator: {
    height: 1,
    backgroundColor: LIGHT_SLATE_GREY, // Separator line color
    marginVertical: 8,
  },
  listContent: {
    paddingBottom: 16, // Extra padding at the bottom
  },
});
