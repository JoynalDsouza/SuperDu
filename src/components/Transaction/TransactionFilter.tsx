import {StyleSheet, View} from 'react-native';
import React from 'react';
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

export type TransactionFilterProps = ModalBaseProps & {
  onApplyFilter: (filters: any) => void;
  filters: TransactionFilterState;
};

const TransactionFilter = ({visible, setVisible, filters, onApplyFilter}) => {
  const [selectedFilters, setSelectedFilters] =
    React.useState<TransactionFilterState>(filters);

  const isEdited = JSON.stringify(selectedFilters) !== JSON.stringify(filters);

  const hasValidFilters = selectedFilters.types.length > 0;

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
                  <Button
                    debounceTime={0}
                    textStyle={{
                      fontSize: 14,
                    }}
                    style={{
                      backgroundColor: isSelected ? 'blue' : 'transparent',
                      borderWidth: 1,
                      borderColor: applyOpacityToHexColor(
                        '#ffffff',
                        isSelected ? 45 : 15,
                      ),
                      borderRadius: 30,
                    }}
                    title={type.name}
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
                    }}></Button>
                );
              })}
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
      </View>
    </ModalBase>
  );
};

export default TransactionFilter;

const styles = StyleSheet.create({});
