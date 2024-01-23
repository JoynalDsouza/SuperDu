import Realm from 'realm';

export class GoalsItem extends Realm.Object {
  static schema = {
    name: 'GoalsItem',
    properties: {
      value: {type: 'string'},
      isCompleted: {type: 'bool'},
    },
  };
}

export default class Plan extends Realm.Object {
  static schema = {
    name: 'Plan',
    properties: {
      _id: 'objectId',
      title: {type: 'string'},
      startTime: {type: 'string'},
      endTime: {type: 'string'},
      repeatSequence: {type: 'list', objectType: 'int'},
      repeatType: {type: 'string'},
      repeatEndDate: {type: 'string'},
      description: {type: 'string'},
      isCompleted: {type: 'bool'},
      goals: {type: 'list', objectType: 'GoalsItem'},
      friends: {type: 'list', objectType: 'string'},
      deleted: {type: 'bool', default: false},
    },
    primaryKey: '_id',
  };
}
