import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {ERROR_RED, LIGHT_SLATE_GREY, PRIMARY_BACKGROUND} from '../design/theme';
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
import {BSON} from 'realm';

const TransactionsScreen = ({route}) => {
  const {startDate, endDate}: TransactionsParams = route?.params;

  const [showOverviewStatsModal, setShowOverviewStatsModal] =
    React.useState(false);

  const [openTransactionFilter, setOpenTransactionFilter] =
    React.useState(false);

  const [filters, setFilters] = React.useState<TransactionFilterState>(
    TRANSACTION_FILTER_INITIAL_STATE,
  );

  const Transactions = useQuery(Transaction).sorted(
    'addedOn',
    filters.startDate ? false : true,
  );

  // Step 1: Filter transactions by selected types (if any types are selected)
  let filteredTransactions = Transactions;

  if (filters.types.length > 0) {
    filteredTransactions = filteredTransactions.filtered(
      'type IN $0',
      filters.types,
    );
  }

  // Step 2: Filter transactions by selected categories (if any categories are selected)
  if (filters.categories.length > 0) {
    // Convert category ID strings to ObjectIds for Realm query
    const categoryObjectIds = filters.categories.map(
      id => new BSON.ObjectId(id),
    );
    filteredTransactions = filteredTransactions.filtered(
      'category._id IN $0',
      categoryObjectIds,
    );
  }

  // Step 3: Apply date range filtering (if startDate or endDate is specified)
  if (filters.startDate) {
    filteredTransactions = filteredTransactions.filtered(
      'addedOn >= $0',
      filters.startDate,
    );
  }

  if (filters.endDate) {
    filteredTransactions = filteredTransactions.filtered(
      'addedOn <= $0',
      filters.endDate,
    );
  }

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
    filters.categories,
    // filters.startDate,
    // filters.endDate,
  ]);

  const hasFilters =
    filters.types.length > 0 ||
    filters.categories.length > 0 ||
    filters.startDate != undefined ||
    filters.endDate != undefined;

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
                    positiveButtonTitle: 'OK',
                    onPositiveButtonPress: () => {},
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

            {/* Render Type Filter */}
            {filters.types.length > 0 && (
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
                  <Text>Type: </Text>
                  <Button
                    type="link"
                    title={`${filters.types.length} filter${
                      filters.types.length === 1 ? '' : 's'
                    } applied`}
                    style={{paddingHorizontal: 0}}
                    onPress={() => {
                      setOpenTransactionFilter(true);
                    }}
                  />
                </View>
                <Button
                  type="link"
                  textStyle={{color: ERROR_RED}}
                  title={'Clear'}
                  onPress={() => {
                    setFilters({...filters, types: []});
                  }}
                />
              </Pressable>
            )}

            {/* Render Start Date Filter */}
            {filters.startDate && (
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
                  <Text>Start Date: </Text>
                  <Button
                    type="link"
                    title={`${filters.startDate.toDateString()}`}
                    style={{paddingHorizontal: 0}}
                    onPress={() => {
                      setOpenTransactionFilter(true);
                    }}
                  />
                </View>
                <Button
                  type="link"
                  textStyle={{color: ERROR_RED}}
                  title={'Clear'}
                  onPress={() => {
                    setFilters({...filters, startDate: null});
                  }}
                />
              </Pressable>
            )}

            {/* Render End Date Filter */}
            {filters.endDate && (
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
                  <Text>End Date: </Text>
                  <Button
                    type="link"
                    title={`${filters.endDate.toDateString()}`}
                    style={{paddingHorizontal: 0}}
                    onPress={() => {
                      setOpenTransactionFilter(true);
                    }}
                  />
                </View>
                <Button
                  type="link"
                  textStyle={{color: ERROR_RED}}
                  title={'Clear'}
                  onPress={() => {
                    setFilters({...filters, endDate: null});
                  }}
                />
              </Pressable>
            )}
          </View>
        )}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredTransactions}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
              <Text
                style={{
                  fontSize: 50,
                  lineHeight: 60,
                }}>
                🚫
              </Text>
              <Text>No transactions found</Text>
            </View>
          )}
          keyExtractor={item => item._id.toString()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: LIGHT_SLATE_GREY, // Separator line color
                marginVertical: 8,
              }}
            />
          )}
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
