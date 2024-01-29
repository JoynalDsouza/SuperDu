import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Navigation from './src/Navigation/navigation';

import {GoalsItem, Plan, Profile} from './src/realm/models';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import schemas from './src/realm/models/schemas';
import {RealmProvider} from '@realm/react';
import {BSON} from 'realm';
import {ExpenseType} from './src/realm/models/User';
import {SafeAreaProvider} from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <RealmProvider
      schema={schemas}
      schemaVersion={1}
      deleteRealmIfMigrationNeeded={true}
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
