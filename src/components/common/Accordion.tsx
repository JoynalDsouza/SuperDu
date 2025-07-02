import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Text from './Text';
import {applyOpacityToHexColor} from '../../design/theme';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isExpanded: controlledExpanded,
  onToggle,
  titleStyle,
  containerStyle,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isExpanded =
    controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}>
        <Text style={{...styles.title, ...titleStyle}}>{title}</Text>
        <Text style={styles.icon}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: applyOpacityToHexColor('#000', 0.1),
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: applyOpacityToHexColor('#000', 0.02),
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  icon: {
    fontSize: 12,
    marginLeft: 8,
  },
  content: {
    padding: 12,
    paddingTop: 8,
  },
});

export default Accordion;
