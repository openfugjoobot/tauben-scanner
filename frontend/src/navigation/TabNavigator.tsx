/**
 * Root Tab Navigator
 * - Home (HomeScreen)
 * - Scan (ScanStackNavigator)
 * - Pigeons (PigeonsStackNavigator)
 * - Settings (SettingsScreen)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { HomeScreen, SettingsScreen } from '../screens';
import { ScanStackNavigator } from './ScanStackNavigator';
import { PigeonsStackNavigator } from './PigeonsStackNavigator';
import type { RootTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#4A90D9',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ScanTab':
              iconName = focused ? 'scan-helper' : 'scan-helper';
              break;
            case 'PigeonsTab':
              iconName = focused ? 'bird' : 'bird';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      
      <Tab.Screen
        name="ScanTab"
        component={ScanStackNavigator}
        options={{
          tabBarLabel: 'Scannen',
        }}
      />
      
      <Tab.Screen
        name="PigeonsTab"
        component={PigeonsStackNavigator}
        options={{
          tabBarLabel: 'Tauben',
        }}
      />
      
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Einstellungen',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F7FA',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
