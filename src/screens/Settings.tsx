import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '../components/common/Button';
import {exportRealmData} from '../utils/realm-import-export';
import {useRealm} from '@realm/react';
import {PRIMARY_BACKGROUND} from '../design/theme';
import ScreenHeader from '../components/common/ScreenHeader';
import {rootNavigate} from '../Navigation/navigation';
import {VERSION_NAME} from '../data/StaticData';

export default function Settings() {
  const realm = useRealm();

  return (
    <View
      style={{
        backgroundColor: PRIMARY_BACKGROUND,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 16,
        flex: 1,
      }}>
      <ScreenHeader title={'Settings'} showBackButton={false} />

      <View style={{flex: 1, gap: 16}}>
        <Button
          type="primary"
          title="Manage Categories"
          onPress={() => {
            rootNavigate('ManageCategories', 'push');
          }}
        />

        <Button
          type="secondary"
          title="Export App data"
          onPress={() => {
            exportRealmData(realm);
          }}
        />
        {__DEV__ && (
          <Button
            type="primary"
            title="Delete App Data"
            onPress={() => {
              realm.write(() => {
                realm.deleteAll();
              });
            }}
          />
        )}
      </View>

      <View>
        <Text style={{color: 'white', textAlign: 'center'}}>
          Version {VERSION_NAME}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
