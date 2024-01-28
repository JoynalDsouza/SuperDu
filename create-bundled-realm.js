import Realm from 'realm';
import {ExpenseType} from './src/realm/models/User';

// open realm
const config = {
  schema: [ExpenseType],
  path: 'bundle.realm',
};
const realm = await Realm.open(config);

// add data to realm
realm.write(() => {
  realm.create('ExpenseType', {
    name: 'Grocery',
  });
  realm.create('ExpenseType', {name: 'Food'});
  realm.create('ExpenseType', {name: 'Commute'});
});

realm.close();
