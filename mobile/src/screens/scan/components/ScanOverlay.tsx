import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ScanInstructions } from './ScanInstructions';

const { width } = Dimensions.get('window');
const MASK_SIZE = width * 0.7;

export const ScanOverlay: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <ScanInstructions />
        </View>
        <View style={styles.middleSection}>
          <View style={styles.sideMask} />
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideMask} />
        </View>
        <View style={styles.bottomSection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  topSection: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingTop: 60,
  },
  middleSection: {
    flexDirection: 'row',
    height: MASK_SIZE,
  },
  sideMask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  frame: {
    width: MASK_SIZE,
    height: MASK_SIZE,
    position: 'relative',
  },
  bottomSection: {
    flex: 1.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#2196F3',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
});
