import notifee from '@notifee/react-native';

export const askNotificationPermission = async () => {
  try {
    await notifee.requestPermission();
  } catch (e) {
    console.log(e);
  }
};

export const askAlarmPermission = async () => {
  try {
    await notifee.openAlarmPermissionSettings();
  } catch (e) {
    console.log(e);
  }
};

export const checkAlarmPermission = async () => {
  const settings = notifee.getNotificationSettings();
  if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
    return true;
  } else {
    askAlarmPermission();
  }
};
