import {Alert} from 'react-native';

type AlertDialogProps = {
  /**
   * **title**: Title of the alert dialog
   * **/
  title: string;
  /**
   * **message**: Message to be displayed in the alert dialog
   * **/
  message: string;
  /**
   * **positiveButtonTitle**: Title of the positive button
   * **/
  positiveButtonTitle?: string;

  /**
   * **negativeButtonTitle**: Title of the negative button
   * **/
  negativeButtonTitle?: string;

  /**
   * **onPositiveButtonPress**: Function to be called when the positive button is pressed
   * **/
  onPositiveButtonPress?: () => void;

  /**
   * **onNegativeButtonPress**: Function to be called when the negative button is pressed
   * **/
  onNegativeButtonPress?: () => void;

  /**
   * **customButtons**: Custom buttons to be displayed in the alert dialog
   * **/
  customButtons?: {text: string; onPress: () => void}[];
};

export const showAlertDialog = ({
  title,
  message,
  positiveButtonTitle,
  negativeButtonTitle,
  onPositiveButtonPress = () => {},
  onNegativeButtonPress = () => {},
  customButtons,
}: AlertDialogProps) => {
  try {
    const buttons = [];

    if (customButtons) {
      buttons.push(...customButtons);
    }

    if (negativeButtonTitle) {
      buttons.push({
        text: negativeButtonTitle,
        onPress: onNegativeButtonPress,
      });
    }

    if (positiveButtonTitle) {
      buttons.push({
        text: positiveButtonTitle,
        onPress: onPositiveButtonPress,
      });
    }

    Alert.alert(title, message, buttons);
  } catch (error) {}
};
