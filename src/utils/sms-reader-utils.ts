import {NativeModules} from 'react-native';
const {SMSReaderModule} = NativeModules;

import {PermissionsAndroid} from 'react-native';

async function checkSMSPermission() {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );
    if (!granted) {
      const response = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      return response === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export const getNativeMessages = async () => {
  try {
    console.log('getNativeMessages');

    const granted = await checkSMSPermission();
    console.log('granted', granted);

    const result = await SMSReaderModule.getMessagesFromDateTime(
      '2023-08-01 14:30:00',
    );

    console.log(result);

    SMSReaderModule.getMessagesFromDateTime('2023-08-01 14:30:00').then(
      messages => {
        console.log(messages);
      },
    );
  } catch (error) {
    console.log('error', error);
  }
};
