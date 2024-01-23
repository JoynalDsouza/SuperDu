import Realm from 'realm';

export default class Plan extends Realm.Object {
  static schema = {
    name: 'Plan',
    properties: {
      _id: 'objectId',
      title: {type: 'string'},
      startTime: {type: 'string'},
      endTime: {type: 'string'},
      repeatSequence: {type: 'array'},
      repeatType: {type: 'string'},
      repeatEndDate: {type: 'string'},
      description: {type: 'string'},
      isCompleted: {type: 'bool'},
      goals: {type: 'array'},
      friends: {type: 'array'},
    },
    primaryKey: '_id',
  };
}
