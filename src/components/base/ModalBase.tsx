import {Modal, StyleSheet, View, ModalProps, Pressable} from 'react-native';
import React from 'react';
import {
  applyOpacityToHexColor,
  ERROR_RED,
  LIGHT_SLATE_GREY,
} from '../../design/theme';
import Text from '../common/Text';
import {showAlertDialog} from '../../utils/alert-utils';

export type ModalBaseProps = ModalProps & {
  onClosePress?: () => void; // Optional function to handle close button press
  showCloseButton?: boolean; // Optional flag to show/hide the close button
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>; // Optional state setter for modal visibility
};

const ModalBase: React.FC<ModalBaseProps> = ({
  visible,
  children,
  setVisible,
  onClosePress,
  showCloseButton = true,
  ...props
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      {...props}>
      {!!showCloseButton && (
        <Pressable
          style={{position: 'absolute', top: 50, right: 20, zIndex: 1}}
          onPress={() => {
            if (onClosePress) {
              onClosePress();
            } else if (setVisible) {
              setVisible(false);
            } else {
              showAlertDialog({
                title: 'No action defined',
                message: 'Please define onClosePress or setVisible',
              });
            }
          }}>
          <Text fontSize={28}>✖️</Text>
        </Pressable>
      )}
      <View style={styles.centeredView}>{children}</View>
    </Modal>
  );
};

export default ModalBase;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: applyOpacityToHexColor(LIGHT_SLATE_GREY, 90),
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
