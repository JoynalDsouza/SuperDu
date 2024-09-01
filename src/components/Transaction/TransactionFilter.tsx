import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import ModalBase, {ModalBaseProps} from '../../components/base/ModalBase';
import {
  TRANSACTION_FILTER_INITIAL_STATE,
  TRANSACTION_TYPES,
} from '../../utils/constants/transactions';
import {TransactionFilterState} from '../../dist/transactions.types';
import {applyOpacityToHexColor, SECONDARY_BACKGROUND} from '../../design/theme';
import Button from '../../components/common/Button';
import ScreenHeader from '../../components/common/ScreenHeader';
import Text from '../../components/common/Text';
import SelectChip from '../../components/common/SelectChip';
import DateTimePicker from 'react-native-ui-datepicker';
import {alertError} from '../../utils/alertError';

export type TransactionFilterProps = ModalBaseProps & {
  onApplyFilter: (filters: any) => void;
  filters: TransactionFilterState;
};

const TransactionFilter = ({visible, setVisible, filters, onApplyFilter}) => {
  const [selectedFilters, setSelectedFilters] =
    useState<TransactionFilterState>(filters);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

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
