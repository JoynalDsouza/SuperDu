import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../common/Text';

type BackIconProps = {
  size?: number;
  onPress?: () => void;
};

const BackIcon: React.FC<BackIconProps> = ({size = 20, onPress}) => {
  return (
    <Pressable disabled={!onPress} onPress={onPress}>
      <Text fontSize={size}>⬅️</Text>
    </Pressable>
  );
};

export default BackIcon;

const styles = StyleSheet.create({});
