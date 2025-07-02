import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import ModalBase, {ModalBaseProps} from '../../components/base/ModalBase';
import {
  TRANSACTION_FILTER_INITIAL_STATE,
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORY_TYPES,
} from '../../utils/constants/transactions';
import {TransactionFilterState} from '../../dist/transactions.types';
import {
  applyOpacityToHexColor,
  SECONDARY_BACKGROUND,
  PRIMARY_BACKGROUND,
  ELECTRIC_BLUE,
  TEAL_BLUE,
  SECONDARY_TEXT,
  PRIMARY_TEXT,
  ERROR_RED,
  SUCCESS_GREEN,
} from '../../design/theme';
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

const TransactionFilterRevamped = ({
  visible,
  setVisible,
  filters,
  onApplyFilter,
}) => {
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
      <View style={styles.container}>
        <ScreenHeader
          showBackButton={false}
          title="Filter Transactions"
          rightIcons={[
            {
              icon: '✖️',
              onPress: () => {
                setVisible(false);
              },
            },
          ]}
        />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* Filter Summary */}
          {hasValidFilters && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Active Filters</Text>
              <View style={styles.summaryContent}>
                {selectedFilters.types.length > 0 && (
                  <Text style={styles.summaryText}>
                    📊 {selectedFilters.types.length} transaction type
                    {selectedFilters.types.length > 1 ? 's' : ''}
                  </Text>
                )}
                {selectedFilters.categories.length > 0 && (
                  <Text style={styles.summaryText}>
                    🏷️ {selectedFilters.categories.length} categor
                    {selectedFilters.categories.length > 1 ? 'ies' : 'y'}
                  </Text>
                )}
                {(selectedFilters.startDate || selectedFilters.endDate) && (
                  <Text style={styles.summaryText}>📅 Date range selected</Text>
                )}
              </View>
            </View>
          )}

          {/* Transaction Types Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💳 Transaction Types</Text>
              {selectedFilters.types.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {selectedFilters.types.length}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.sectionSubtitle}>
              Select the types of transactions to include
            </Text>
            <View style={styles.chipContainer}>
              {TRANSACTION_TYPES.map(type => {
                const isSelected = selectedFilters.types.includes(type.value);
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.modernChip,
                      isSelected && styles.modernChipSelected,
                    ]}
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
                    }}>
                    <Text
                      style={{
                        ...(styles.modernChipText as TextStyle),
                        ...(isSelected &&
                          (styles.modernChipTextSelected as TextStyle)),
                      }}>
                      {type.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏷️ Categories</Text>
              {selectedFilters.categories.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {selectedFilters.categories.length}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.sectionSubtitle}>
              Choose specific categories to filter by
            </Text>

            <Accordion
              title={`${filteredCategories.length} Available Categories`}
              isExpanded={categoryAccordionExpanded}
              onToggle={setCategoryAccordionExpanded}
              containerStyle={styles.accordion}>
              {filteredCategories.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>📭</Text>
                  <Text style={styles.emptyStateTitle}>
                    No Categories Available
                  </Text>
                  <Text style={styles.emptyStateText}>
                    {selectedFilters.types.length > 0
                      ? 'No categories match your selected transaction types'
                      : 'Select transaction types first to see available categories'}
                  </Text>
                </View>
              ) : (
                <View style={styles.categoryGroups}>
                  {TRANSACTION_CATEGORY_TYPES.map(transactionCat => {
                    const categoryGroup =
                      categoriesByTransactionType[transactionCat.value];
                    if (!categoryGroup || categoryGroup.length === 0)
                      return null;

                    return (
                      <View
                        key={transactionCat.value}
                        style={styles.categoryGroup}>
                        <Text style={styles.categoryGroupTitle}>
                          {transactionCat.name}
                        </Text>
                        <View style={styles.chipContainer}>
                          {categoryGroup.map(category => {
                            const isSelected =
                              selectedFilters.categories.includes(
                                category._id.toString(),
                              );
                            return (
                              <TouchableOpacity
                                key={category._id.toString()}
                                style={[
                                  styles.categoryChip,
                                  isSelected && styles.categoryChipSelected,
                                ]}
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
                                }}>
                                <Text
                                  style={{
                                    ...(styles.categoryChipText as TextStyle),
                                    ...(isSelected &&
                                      (styles.categoryChipTextSelected as TextStyle)),
                                  }}>
                                  {category.name}
                                </Text>
                                {isSelected && (
                                  <View style={styles.categoryCheckmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}

                  {categoriesByTransactionType['OTHER'] &&
                    categoriesByTransactionType['OTHER'].length > 0 && (
                      <View style={styles.categoryGroup}>
                        <Text style={styles.categoryGroupTitle}>Other</Text>
                        <View style={styles.chipContainer}>
                          {categoriesByTransactionType['OTHER'].map(
                            category => {
                              const isSelected =
                                selectedFilters.categories.includes(
                                  category._id.toString(),
                                );
                              return (
                                <TouchableOpacity
                                  key={category._id.toString()}
                                  style={[
                                    styles.categoryChip,
                                    isSelected && styles.categoryChipSelected,
                                  ]}
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
                                  }}>
                                  <Text
                                    style={{
                                      ...(styles.categoryChipText as TextStyle),
                                      ...(isSelected &&
                                        (styles.categoryChipTextSelected as TextStyle)),
                                    }}>
                                    {category.name}
                                  </Text>
                                  {isSelected && (
                                    <View style={styles.categoryCheckmark}>
                                      <Text style={styles.checkmarkText}>
                                        ✓
                                      </Text>
                                    </View>
                                  )}
                                </TouchableOpacity>
                              );
                            },
                          )}
                        </View>
                      </View>
                    )}
                </View>
              )}
            </Accordion>
          </View>

          {/* Date Range Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Date Range</Text>
              {(selectedFilters.startDate || selectedFilters.endDate) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>📅</Text>
                </View>
              )}
            </View>
            <Text style={styles.sectionSubtitle}>
              Filter transactions by date
            </Text>

            <View style={styles.dateRangeContainer}>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  selectedFilters.startDate && styles.dateButtonSelected,
                ]}
                onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.dateButtonLabel}>From</Text>
                <Text
                  style={{
                    ...(styles.dateButtonText as TextStyle),
                    ...(selectedFilters.startDate &&
                      (styles.dateButtonTextSelected as TextStyle)),
                  }}>
                  {selectedFilters.startDate
                    ? selectedFilters.startDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Select start date'}
                </Text>
              </TouchableOpacity>

              <View style={styles.dateConnector}>
                <View style={styles.dateLine} />
                <Text style={styles.dateConnectorText}>to</Text>
                <View style={styles.dateLine} />
              </View>

              <TouchableOpacity
                style={[
                  styles.dateButton,
                  selectedFilters.endDate && styles.dateButtonSelected,
                ]}
                onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.dateButtonLabel}>Until</Text>
                <Text
                  style={{
                    ...(styles.dateButtonText as TextStyle),
                    ...(selectedFilters.endDate &&
                      (styles.dateButtonTextSelected as TextStyle)),
                  }}>
                  {selectedFilters.endDate
                    ? selectedFilters.endDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Select end date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.clearButton,
              !hasValidFilters && styles.disabledButton,
            ]}
            onPress={() => {
              setSelectedFilters(TRANSACTION_FILTER_INITIAL_STATE);
            }}
            disabled={!hasValidFilters}>
            <Text
              style={{
                ...(styles.actionButtonText as TextStyle),
                ...(styles.clearButtonText as TextStyle),
                ...(!hasValidFilters &&
                  (styles.disabledButtonText as TextStyle)),
              }}>
              Clear All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.applyButton,
              !isEdited && styles.disabledButton,
            ]}
            onPress={() => {
              onApplyFilter(selectedFilters);
              setVisible(false);
            }}
            disabled={!isEdited}>
            <Text
              style={{
                ...(styles.actionButtonText as TextStyle),
                ...(styles.applyButtonText as TextStyle),
                ...(!isEdited && (styles.disabledButtonText as TextStyle)),
              }}>
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && (
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select Start Date</Text>
                <TouchableOpacity
                  style={styles.datePickerClose}
                  onPress={() => setShowStartDatePicker(false)}>
                  <Text style={styles.datePickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
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
          </View>
        )}

        {showEndDatePicker && (
          <View style={styles.datePickerOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Select End Date</Text>
                <TouchableOpacity
                  style={styles.datePickerClose}
                  onPress={() => setShowEndDatePicker(false)}>
                  <Text style={styles.datePickerCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
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
          </View>
        )}
      </View>
    </ModalBase>
  );
};

export default TransactionFilterRevamped;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: SECONDARY_BACKGROUND,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: applyOpacityToHexColor(TEAL_BLUE, 10),
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: TEAL_BLUE,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT,
    marginBottom: 8,
  },
  summaryContent: {
    gap: 4,
  },
  summaryText: {
    fontSize: 14,
    color: SECONDARY_TEXT,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_TEXT,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: ELECTRIC_BLUE,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modernChip: {
    backgroundColor: applyOpacityToHexColor(ELECTRIC_BLUE, 15),
    borderWidth: 1,
    borderColor: applyOpacityToHexColor(ELECTRIC_BLUE, 30),
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  modernChipSelected: {
    backgroundColor: applyOpacityToHexColor(ELECTRIC_BLUE, 25),
    borderColor: ELECTRIC_BLUE,
    borderWidth: 2,
  },
  modernChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: PRIMARY_TEXT,
  } as TextStyle,
  modernChipTextSelected: {
    color: ELECTRIC_BLUE,
    fontWeight: '600',
  } as TextStyle,
  checkmark: {
    backgroundColor: ELECTRIC_BLUE,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accordion: {
    marginBottom: 8,
    backgroundColor: applyOpacityToHexColor('#FFFFFF', 5),
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: SECONDARY_TEXT,
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryGroups: {
    gap: 16,
  },
  categoryGroup: {
    marginBottom: 16,
  },
  categoryGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_TEXT,
    marginBottom: 12,
    paddingLeft: 8,
  },
  categoryChip: {
    backgroundColor: applyOpacityToHexColor(TEAL_BLUE, 15),
    borderWidth: 1,
    borderColor: applyOpacityToHexColor(TEAL_BLUE, 30),
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
  },
  categoryChipSelected: {
    backgroundColor: applyOpacityToHexColor(TEAL_BLUE, 25),
    borderColor: TEAL_BLUE,
    borderWidth: 2,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: PRIMARY_TEXT,
  } as TextStyle,
  categoryChipTextSelected: {
    color: TEAL_BLUE,
    fontWeight: '600',
  } as TextStyle,
  categoryCheckmark: {
    backgroundColor: TEAL_BLUE,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRangeContainer: {
    gap: 12,
  },
  dateButton: {
    backgroundColor: applyOpacityToHexColor('#FFFFFF', 8),
    borderWidth: 1,
    borderColor: applyOpacityToHexColor('#FFFFFF', 20),
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  dateButtonSelected: {
    backgroundColor: applyOpacityToHexColor(ELECTRIC_BLUE, 15),
    borderColor: ELECTRIC_BLUE,
    borderWidth: 2,
  },
  dateButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: SECONDARY_TEXT,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: PRIMARY_TEXT,
  } as TextStyle,
  dateButtonTextSelected: {
    color: ELECTRIC_BLUE,
    fontWeight: '600',
  } as TextStyle,
  dateConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: applyOpacityToHexColor('#FFFFFF', 20),
  },
  dateConnectorText: {
    fontSize: 12,
    color: SECONDARY_TEXT,
    marginHorizontal: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: applyOpacityToHexColor('#000000', 30),
    borderTopWidth: 1,
    borderTopColor: applyOpacityToHexColor('#FFFFFF', 10),
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: ERROR_RED,
  },
  applyButton: {
    backgroundColor: SUCCESS_GREEN,
  },
  disabledButton: {
    opacity: 0.4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  clearButtonText: {
    color: ERROR_RED,
  } as TextStyle,
  applyButtonText: {
    color: '#FFFFFF',
  } as TextStyle,
  disabledButtonText: {
    opacity: 0.6,
  } as TextStyle,
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: PRIMARY_BACKGROUND,
    borderRadius: 16,
    margin: 20,
    maxWidth: Dimensions.get('window').width - 40,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: applyOpacityToHexColor('#FFFFFF', 10),
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PRIMARY_TEXT,
  },
  datePickerClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: applyOpacityToHexColor('#FFFFFF', 10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerCloseText: {
    fontSize: 16,
    color: PRIMARY_TEXT,
    fontWeight: 'bold',
  },
});
