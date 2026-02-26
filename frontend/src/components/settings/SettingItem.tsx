import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

export interface SettingItemProps {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  testID?: string;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  onPress,
  rightElement,
  showArrow = false,
  disabled = false,
  destructive = false,
  style,
  titleStyle,
  descriptionStyle,
  testID,
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const isPressable = !!onPress && !disabled;

  const content = (
    <View style={[styles.container, disabled && styles.disabled, style]} testID={testID}>
      <View style={[styles.iconContainer, destructive && styles.destructiveIconContainer]}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={destructive ? '#E74C3C' : '#4A90D9'}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, destructive && styles.destructiveTitle, titleStyle]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.description, descriptionStyle]}>{description}</Text>
        )}
      </View>
      
      <View style={styles.rightContainer}>
        {rightElement}
        {showArrow && !rightElement && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={disabled ? '#BDC3C7' : '#7F8C8D'}
          />
        )}
      </View>
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EBF4FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconContainer: {
    backgroundColor: '#FDEBEB',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  destructiveTitle: {
    color: '#E74C3C',
  },
  description: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingItem;
