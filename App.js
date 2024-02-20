import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import Navigation from './src/Navigation/navigation';

import schemas from './src/realm/models/schemas';
import {RealmProvider} from '@realm/react';
import {BSON} from 'realm';
import {ExpenseType} from './src/realm/models/User';

function App() {
  return (
    <RealmProvider
      schema={schemas}
      schemaVersion={3}
      deleteRealmIfMigrationNeeded={false}
      onFirstOpen={realm => {
        realm.create(ExpenseType, {
          _id: new BSON.ObjectID(),
          name: 'Grocery',
          isActive: true,
        });
        realm.create(ExpenseType, {
          _id: new BSON.ObjectID(),

          name: 'Food',
          isActive: true,
        });
        realm.create(ExpenseType, {
          _id: new BSON.ObjectID(),

          name: 'Commute',
          isActive: true,
        });
      }}
      onMigration={(oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < 2) {
          const oldObjects = oldRealm.objects('Expense');
          const newObjects = newRealm.objects('Expense');
          for (let i = 0; i < oldObjects.length; i++) {
            newObjects[i].notes = '';
          }
        }
        if (oldRealm.schemaVersion < 3) {
          const changed = ['Investment', 'Lending', 'Income'];
          changed.forEach(type => {
            const oldObjects = oldRealm.objects(type);
            const newObjects = newRealm.objects(type);
            for (let i = 0; i < oldObjects.length; i++) {
              newObjects[i].notes = '';
            }
          });
        }
      }}>
      <SafeAreaView style={{flex: 1}}>
        <Navigation />
      </SafeAreaView>
    </RealmProvider>
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
