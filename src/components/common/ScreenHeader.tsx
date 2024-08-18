import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from './Text';
import BackIcon from '../icons/BackIcon';
import {rootNavigate} from '../../Navigation/navigation';

export type ICON = {
  icon: string;
  onPress: () => void;
};

type ScreenHeaderProps = {
  title: string;
  customCenterComponent?: React.ReactNode;
  customRightComponent?: React.ReactNode;
  customLeftComponent?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftIcons?: ICON[];
  rightIcons?: ICON[];
};

const HeaderIconContainer: React.FC<{
  icons: Array<ICON>;
}> = ({icons}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}>
      {icons.map((icon, index) => (
        <Pressable key={index} onPress={icon.onPress} style={{padding: 8}}>
          <Text>{icon.icon}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  customCenterComponent,
  customRightComponent,
  customLeftComponent,
  showBackButton = true,
  onBackPress,
  leftIcons,
  rightIcons,
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{flex: 1}}>
        <View style={{alignSelf: 'flex-start'}}>
          {customLeftComponent ? (
            customLeftComponent
          ) : !!leftIcons?.length ? (
            <HeaderIconContainer icons={leftIcons}></HeaderIconContainer>
          ) : (
            showBackButton && (
              <BackIcon
                onPress={() => {
                  if (onBackPress) {
                    onBackPress();
                  } else {
                    rootNavigate();
                  }
                }}
              />
            )
          )}
        </View>
      </View>

      <View>
        {customCenterComponent ? (
          customCenterComponent
        ) : (
          <Text variant="h3">{title}</Text>
        )}
      </View>

      <View style={{flex: 1}}>
        <View style={{alignSelf: 'flex-end'}}>
          {customRightComponent
            ? customRightComponent
            : !!rightIcons?.length && (
                <HeaderIconContainer icons={rightIcons}></HeaderIconContainer>
              )}
        </View>
      </View>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({});
