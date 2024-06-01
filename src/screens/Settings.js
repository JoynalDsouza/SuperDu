import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '../components/common/Button';
import {useRealm} from '@realm/react';
import {exportRealmData} from '../utils/realm-import-export';

export default function Settings() {
  const realm = useRealm();
  return (
    <View style={{paddingHorizontal: 16, flex: 1}}>
      <View style={{flex: 1}}></View>
      <Button
        style={{marginVertical: 16}}
        title="Export App data"
        onPress={() => {
          exportRealmData(realm);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
