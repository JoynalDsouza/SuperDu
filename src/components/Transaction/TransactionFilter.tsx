import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import ModalBase, {ModalBaseProps} from '../../components/base/ModalBase';
import {
  TRANSACTION_FILTER_INITIAL_STATE,
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORY_TYPES,
} from '../../utils/constants/transactions';
import {TransactionFilterState} from '../../dist/transactions.types';
import {applyOpacityToHexColor, SECONDARY_BACKGROUND} from '../../design/theme';
import Button from '../../components/common/Button';
import ScreenHeader from '../../components/common/ScreenHeader';
import Text from '../../components/common/Text';
import SelectChip from '../../components/common/SelectChip';
import Accordion from '../../components/common/Accordion';
import DateTimePicker from 'react-native-ui-datepicker';
import {alertError} from '../../utils/alertError';
import {useQuery} from '@realm/react';
import {Category} from '../../realm/models/Account';

export type TransactionFilterProps = ModalBaseProps & {
  onApplyFilter: (filters: any) => void;
  filters: TransactionFilterState;
};

const TransactionFilter = ({visible, setVisible, filters, onApplyFilter}) => {
  const [selectedFilters, setSelectedFilters] =
    useState<TransactionFilterState>(filters);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [categoryAccordionExpanded, setCategoryAccordionExpanded] =
    useState(false);

  // Get all categories from realm
  const allCategories = useQuery(Category).filtered('isActive == true');

  // Filter categories based on selected transaction types
  const filteredCategories = useMemo(() => {
    if (selectedFilters.types.length === 0) {
      return allCategories;
    }

    const typeFilter = selectedFilters.types
      .map(type => `type == "${type}"`)
      .join(' OR ');
    return allCategories.filtered(typeFilter);
  }, [allCategories, selectedFilters.types]);

  // Group categories by transaction category (NEED, WANT, SAVINGS)
  const categoriesByTransactionType = useMemo(() => {
    const grouped = {};

    TRANSACTION_CATEGORY_TYPES.forEach(transactionCat => {
      grouped[transactionCat.value] = filteredCategories.filter(
        cat => cat.transactionCategory === transactionCat.value,
      );
    });

    // Add categories without transaction category
    grouped['OTHER'] = filteredCategories.filter(
      cat => !cat.transactionCategory,
    );

    return grouped;
  }, [filteredCategories]);

  // Clear selected categories when transaction types change
  useEffect(() => {
    if (selectedFilters.categories.length > 0) {
      // Check if any selected categories are no longer available with current type filters
      const availableCategoryIds = filteredCategories.map(cat =>
        cat._id.toString(),
      );
      const validCategories = selectedFilters.categories.filter(catId =>
        availableCategoryIds.includes(catId),
      );

      if (validCategories.length !== selectedFilters.categories.length) {
        setSelectedFilters({
          ...selectedFilters,
          categories: validCategories,
        });
      }
    }
  }, [selectedFilters.types]);

  const handleStartDateChange = date => {
    if (selectedFilters.endDate && date > selectedFilters.endDate) {
      alertError('Start date cannot be later than end date.');
      return;
    }
    setSelectedFilters({...selectedFilters, startDate: date});
  };

  const handleEndDateChange = date => {
    if (selectedFilters.startDate && date < selectedFilters.startDate) {
      alertError('End date cannot be earlier than start date.');
      return;
    }
    setSelectedFilters({...selectedFilters, endDate: date});
  };

  const isEdited = JSON.stringify(selectedFilters) !== JSON.stringify(filters);

  const hasValidFilters =
    selectedFilters.types.length > 0 ||
    selectedFilters.categories.length > 0 ||
    selectedFilters.startDate ||
    selectedFilters.endDate;

  return (
    <ModalBase
      visible={visible}
      setVisible={setVisible}
      showCloseButton={false}>
      <View
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: SECONDARY_BACKGROUND,
          paddingHorizontal: 16,
        }}>
        <View style={{flex: 1, gap: 8}}>
          <ScreenHeader
            showBackButton={false}
            title="Filters"
            rightIcons={[
              {
                icon: '✖️',
                onPress: () => {
                  setVisible(false);
                },
              },
            ]}
          />

          <View style={{gap: 4}}>
            <Text>Expense Type</Text>
            <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
              {TRANSACTION_TYPES.map(type => {
                const isSelected = selectedFilters.types.includes(type.value);
                return (
                  <SelectChip
                    title={type.name}
                    isSelected={isSelected}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedFilters({
                          ...selectedFilters,
                          types: selectedFilters.types.filter(
                            t => t !== type.value,
                          ),
                        });
                      } else {
                        setSelectedFilters({
                          ...selectedFilters,
                          types: [...selectedFilters.types, type.value],
                        });
                      }
                    }}
                  />
                );
              })}
            </View>
          </View>

          <View style={{gap: 4}}>
            <Accordion
              title={`Categories ${
                selectedFilters.categories.length > 0
                  ? `(${selectedFilters.categories.length})`
                  : ''
              }`}
              isExpanded={categoryAccordionExpanded}
              onToggle={setCategoryAccordionExpanded}
              containerStyle={{marginBottom: 8}}>
              {filteredCategories.length === 0 ? (
                <Text
                  style={{
                    textAlign: 'center',
                    fontStyle: 'italic',
                    color: '#666',
                  }}>
                  {selectedFilters.types.length > 0
                    ? 'No categories available for selected transaction types'
                    : 'Select transaction types to see available categories'}
                </Text>
              ) : (
                <>
                  {TRANSACTION_CATEGORY_TYPES.map(transactionCat => {
                    const categoryGroup =
                      categoriesByTransactionType[transactionCat.value];
                    if (!categoryGroup || categoryGroup.length === 0)
                      return null;

                    return (
                      <View
                        key={transactionCat.value}
                        style={{marginBottom: 12}}>
                        <Text style={{fontWeight: '600', marginBottom: 8}}>
                          {transactionCat.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}>
                          {categoryGroup.map(category => {
                            const isSelected =
                              selectedFilters.categories.includes(
                                category._id.toString(),
                              );
                            return (
                              <SelectChip
                                key={category._id.toString()}
                                title={category.name}
                                isSelected={isSelected}
                                onPress={() => {
                                  const categoryId = category._id.toString();
                                  if (isSelected) {
                                    setSelectedFilters({
                                      ...selectedFilters,
                                      categories:
                                        selectedFilters.categories.filter(
                                          id => id !== categoryId,
                                        ),
                                    });
                                  } else {
                                    setSelectedFilters({
                                      ...selectedFilters,
                                      categories: [
                                        ...selectedFilters.categories,
                                        categoryId,
                                      ],
                                    });
                                  }
                                }}
                              />
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}

                  {categoriesByTransactionType['OTHER'] &&
                    categoriesByTransactionType['OTHER'].length > 0 && (
                      <View style={{marginBottom: 12}}>
                        <Text style={{fontWeight: '600', marginBottom: 8}}>
                          Other
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}>
                          {categoriesByTransactionType['OTHER'].map(
                            category => {
                              const isSelected =
                                selectedFilters.categories.includes(
                                  category._id.toString(),
                                );
                              return (
                                <SelectChip
                                  key={category._id.toString()}
                                  title={category.name}
                                  isSelected={isSelected}
                                  onPress={() => {
                                    const categoryId = category._id.toString();
                                    if (isSelected) {
                                      setSelectedFilters({
                                        ...selectedFilters,
                                        categories:
                                          selectedFilters.categories.filter(
                                            id => id !== categoryId,
                                          ),
                                      });
                                    } else {
                                      setSelectedFilters({
                                        ...selectedFilters,
                                        categories: [
                                          ...selectedFilters.categories,
                                          categoryId,
                                        ],
                                      });
                                    }
                                  }}
                                />
                              );
                            },
                          )}
                        </View>
                      </View>
                    )}
                </>
              )}
            </Accordion>
          </View>

          <View style={{gap: 4}}>
            <Text>Date Range</Text>
            <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
              <Button
                title={
                  selectedFilters.startDate
                    ? selectedFilters.startDate.toDateString()
                    : 'Start Date'
                }
                type="primary"
                onPress={() => setShowStartDatePicker(true)}
                style={{flex: 1}}
              />
              <Text>TO</Text>
              <Button
                title={
                  selectedFilters.endDate
                    ? selectedFilters.endDate.toDateString()
                    : 'End Date'
                }
                type="secondary"
                onPress={() => setShowEndDatePicker(true)}
                style={{flex: 1}}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 8,
            gap: 16,
          }}>
          <Button
            type="secondary"
            style={{flex: 1}}
            title="Clear All"
            onPress={() => {
              setSelectedFilters(TRANSACTION_FILTER_INITIAL_STATE);
            }}
            disabled={!hasValidFilters}
          />
          <Button
            title="Apply"
            style={{flex: 1}}
            disabled={!isEdited}
            onPress={() => {
              onApplyFilter(selectedFilters);
              setVisible(false);
            }}
          />
        </View>

        {showStartDatePicker && (
          <View style={styles.datePickerOverlay}>
            <DateTimePicker
              mode="single"
              date={selectedFilters.startDate || new Date()}
              onChange={params => {
                try {
                  // @ts-ignore
                  const date = new Date(params.date?.toDate());
                  handleStartDateChange(date);
                  setShowStartDatePicker(false);
                } catch (e) {
                  alertError(e);
                }
              }}
            />
          </View>
        )}

        {showEndDatePicker && (
          <View style={styles.datePickerOverlay}>
            <DateTimePicker
              mode="single"
              date={selectedFilters.endDate || new Date()}
              calendarTextStyle={{
                backgroundColor: applyOpacityToHexColor('#000', 0.1),
              }}
              onChange={params => {
                try {
                  // @ts-ignore
                  const date = new Date(params.date?.toDate());
                  handleEndDateChange(date);
                  setShowEndDatePicker(false);
                } catch (e) {
                  alertError(e);
                }
              }}
            />
          </View>
        )}
      </View>
    </ModalBase>
  );
};

export default TransactionFilter;

const styles = StyleSheet.create({
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(245, 252, 255, 1)',
  },
});
