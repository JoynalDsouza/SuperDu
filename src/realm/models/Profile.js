import Realm from 'realm';

export default class Profile extends Realm.Object {
  static schema = {
    name: 'Profile',
    properties: {
      _id: 'objectId',
      name: {type: 'string', indexed: 'full-text'},
    },
    primaryKey: '_id',
  };
}
