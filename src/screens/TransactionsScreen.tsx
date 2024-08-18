import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {ERROR_RED, PRIMARY_BACKGROUND} from '../design/theme';
import ScreenHeader from '../components/common/ScreenHeader';
import {useQuery} from '@realm/react';
import {Transaction} from '../realm/models/Account';
import TransactionCard from '../components/Transaction/TransactionCard';
import {getOverviewStats} from '../utils/transaction-utils';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import ModalBase from '../components/base/ModalBase';
import {TransactionFilterState} from 'dist/transactions.types';
import {TRANSACTION_FILTER_INITIAL_STATE} from '../utils/constants/transactions';
import TransactionFilter from '../components/Transaction/TransactionFilter';
import {showAlertDialog} from '../utils/alert-utils';
import Text from '../components/common/Text';
import Button from '../components/common/Button';
import {TransactionsParams} from '../Navigation/navigation.types';

const TransactionsScreen = ({route}) => {
  const {startDate, endDate}: TransactionsParams = route?.params;

  const [showOverviewStatsModal, setShowOverviewStatsModal] =
    React.useState(false);

  const [openTransactionFilter, setOpenTransactionFilter] =
    React.useState(false);

  const [filters, setFilters] = React.useState<TransactionFilterState>(
    TRANSACTION_FILTER_INITIAL_STATE,
  );

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     setFilters({
  //       ...filters,
  //       startDate: new Date(startDate),
  //       endDate: new Date(endDate),
  //     });
  //   }
  // }, []);

  const Transactions = useQuery(Transaction).sorted('addedOn', true);

  const filteredTransactions =
    filters.types.length > 0
      ? Transactions.filtered('type IN $0', filters.types)
      : Transactions;

  const {
    daysWithoutExpenses,
    totalIncome,
    totalExpense,
    totalLending,
    totalInvestment,
    totalBalance,
  } = useMemo(() => {
    return getOverviewStats(filteredTransactions);
  }, [
    filteredTransactions?.length,
    filters.types,
    // filters.startDate,
    // filters.endDate,
  ]);

  const hasFilters = filters.types.length > 0;

  return (
    <>
      <View
        style={{
          backgroundColor: PRIMARY_BACKGROUND,
          gap: 16,
          paddingHorizontal: 16,
          paddingVertical: 16,
          flex: 1,
        }}>
        <ScreenHeader
          title={'Transactions'}
          rightIcons={[
            {
              icon: '🔍',
              onPress: () => {
                setOpenTransactionFilter(true);
              },
            },
            {
              icon: '👁️',
              onPress: () => {
                if (hasFilters) {
                  showAlertDialog({
                    title: 'Overview not available',
                    message: 'Please clear the filters to view the overview',
                  });
                  return;
                }
                setShowOverviewStatsModal(true);
              },
            },
          ]}
        />

        {hasFilters && (
          <View>
            <Text>Transaction Filters</Text>
            {Object.keys(filters).map(key => {
              if (filters[key].length > 0) {
                return (
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text>{key == 'types' ? 'Type' : key} : </Text>
                      <Button
                        type="link"
                        title={`${filters[key]?.length} filter${
                          filters[key].length === 1 ? '' : 's'
                        } applied`}
                        style={{
                          paddingHorizontal: 0,
                        }}
                        onPress={() => {
                          setOpenTransactionFilter(true);
                        }}></Button>
                    </View>
                    <Button
                      type="link"
                      textStyle={{
                        color: ERROR_RED,
                      }}
                      title={'Clear'}
                      onPress={() => {
                        setFilters({
                          ...filters,
                          [key]: [],
                        });
                      }}
                    />
                  </Pressable>
                );
              } else {
                return null;
              }
            })}
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredTransactions}
          keyExtractor={item => item._id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          renderItem={({item}) => {
            const {_id, type, category, addedOn, amount} = item;
            return (
              <TransactionCard
                id={_id.toString()}
                type={type}
                category={category.name}
                addedOn={addedOn}
                amount={amount}
              />
            );
          }}
        />
        <ModalBase
          visible={showOverviewStatsModal}
          setVisible={setShowOverviewStatsModal}
          onRequestClose={() => setShowOverviewStatsModal(false)}>
          <FinancialSummary
            daysWithoutExpenses={daysWithoutExpenses}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            totalLending={totalLending}
            totalInvestment={totalInvestment}
            totalBalance={totalBalance}
          />
        </ModalBase>

        {openTransactionFilter && (
          <TransactionFilter
            visible={openTransactionFilter}
            setVisible={setOpenTransactionFilter}
            filters={filters}
            onApplyFilter={(filters: TransactionFilterState) => {
              setFilters(filters);
              setOpenTransactionFilter(false);
            }}
          />
        )}
      </View>
    </>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({});
