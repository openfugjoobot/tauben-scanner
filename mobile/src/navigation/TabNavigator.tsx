import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ScanStackNavigator } from './ScanStackNavigator';
import { PigeonsStackNavigator } from './PigeonsStackNavigator';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'help';
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScanFlow') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'PigeonsFlow') {
            iconName = focused ? 'bird' : 'bird';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        sceneContainerStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          color: theme.colors.onSurfaceVariant,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Start' }}
      />
      <Tab.Screen 
        name="ScanFlow" 
        component={ScanStackNavigator}
        options={{ title: 'Scan' }}
      />
      <Tab.Screen 
        name="PigeonsFlow" 
        component={PigeonsStackNavigator}
        options={{ title: 'Tauben' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Einstellungen' }}
      />
    </Tab.Navigator>
  );
};
