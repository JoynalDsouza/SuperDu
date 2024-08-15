import React from 'react';
import {LogBox, SafeAreaView, StyleSheet} from 'react-native';

import Navigation from './src/Navigation/navigation';

import schemas from './src/realm/models/schemas';
import {RealmProvider} from '@realm/react';
import {BSON} from 'realm';
import {ExpenseType} from './src/realm/models/User';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export const SCHEMA_VERSION = 6;

function App() {
  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RealmProvider
        schema={schemas}
        schemaVersion={SCHEMA_VERSION}
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
          if (oldRealm.schemaVersion < 4) {
          }

          if (oldRealm.schemaVersion < 5) {
          }

          if (oldRealm.schemaVersion < 6) {
            const categoryChanged = [
              'ExpenseType',
              'IncomeType',
              'InvestmentType',
              'LendingType',
            ];

            const categoryMap = {
              ExpenseType: 'EXPENSE',
              IncomeType: 'INCOME',
              InvestmentType: 'INVESTMENT',
              LendingType: 'LENDING',
            };

            const categoryIdsMap = {};

            categoryChanged.forEach(type => {
              const oldObjects = oldRealm.objects(type);
              for (let i = 0; i < oldObjects.length; i++) {
                const _id = new BSON.ObjectID();
                categoryIdsMap[oldObjects[i].name] = _id;
                newRealm.create('Category', {
                  _id: _id,
                  name: oldObjects[i].name,
                  type: categoryMap[type],
                  isActive: oldObjects[i].isActive,
                });
              }
            });

            const changed = ['Investment', 'Lending', 'Income', 'Expense'];

            changed.forEach(type => {
              const oldObjects = oldRealm.objects(type);

              for (let i = 0; i < oldObjects.length; i++) {
                newRealm.create('Transaction', {
                  _id: new BSON.ObjectID(),
                  amount: oldObjects[i].value,
                  type: type?.toUpperCase(),
                  category: newRealm.objectForPrimaryKey(
                    'Category',
                    categoryIdsMap[oldObjects[i].type.name],
                  ),
                  addedOn: oldObjects[i].addedOn,
                  modifiedOn: oldObjects[i].addedOn,
                  notes: oldObjects[i].notes,
                  from: null,
                });
              }
            });
          }
        }}>
        <SafeAreaView style={{flex: 1}}>
          <Navigation />
        </SafeAreaView>
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
