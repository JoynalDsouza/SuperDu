import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import Button from '../common/Button';
import Text from '../common/Text';
import {useQuery} from '@realm/react';
import {Transaction} from 'realm/models/Account';
import {LIGHT_SLATE_GREY} from '../../design/theme';
import TransactionCard from '../Transaction/TransactionCard';
import {rootNavigate} from '../../Navigation/navigation';

const RecentTransactions = () => {
  const RecentTransactions = useQuery<Transaction>('Transaction')
    .sorted('addedOn', true)
    .slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2">Recent Transactions</Text>
        <Button
          title="View All"
          type="link"
          onPress={() => {
            rootNavigate('Transactions', 'navigate');
          }}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={RecentTransactions}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => {
          const {type, category, addedOn, amount} = item;
          return (
            <TransactionCard
              type={type}
              category={category.name}
              addedOn={addedOn}
              amount={amount}
              id={item._id.toString()}
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
