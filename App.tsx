import React, {useEffect, useState} from 'react';
import {LogBox, StyleSheet} from 'react-native';

import Navigation from './src/Navigation/navigation';

import schemas from './src/realm/models/schemas';
import {RealmProvider} from '@realm/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {applyMigration} from './src/realm/migration';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export const SCHEMA_VERSION = 6;

function App() {
  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RealmProvider
        schema={schemas}
        schemaVersion={SCHEMA_VERSION}
        deleteRealmIfMigrationNeeded={false}
        onMigration={(oldRealm, newRealm) => {
          if (oldRealm.schemaVersion < 2) {
            applyMigration(newRealm, 2);
          }
          if (oldRealm.schemaVersion < 3) {
            applyMigration(newRealm, 3);
          }
          if (oldRealm.schemaVersion < 4) {
            applyMigration(newRealm, 4);
          }

          if (oldRealm.schemaVersion < 5) {
            applyMigration(newRealm, 5);
          }

          if (oldRealm.schemaVersion < 6) {
            applyMigration(newRealm, 6);
          }
        }}>
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1, backgroundColor: '#121212'}}>
            <Navigation />
          </SafeAreaView>
        </SafeAreaProvider>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
