import React from 'react';
import { View, StyleSheet, TouchableOpacity, Share, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { palette } from '../../../theme/colors';
import { Pigeon } from '../../../services/api/apiClient.types';

interface PigeonDetailHeaderProps {
  pigeon: Pigeon;
  onEdit: () => void;
  onDelete: () => void;
}

export const PigeonDetailHeader: React.FC<PigeonDetailHeaderProps> = ({
  pigeon,
  onEdit,
  onDelete,
}) => {
  const navigation = useNavigation<any>();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Schau dir diese Taube an: ${pigeon.name} (${pigeon.color})`,
        url: pigeon.photoUrl,
      });
    } catch (error) {
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Taube löschen',
      'Möchten Sie diese Taube wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {pigeon.photoUrl ? (
        <Image source={{ uri: pigeon.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Icon name="bird" size={80} color={palette.gray[400]} />
        </View>
      )}

      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share-variant" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Icon name="pencil" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={confirmDelete}>
            <Icon name="trash-can" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text variant="h1" style={styles.name}>
          {pigeon.name}
        </Text>
        <Text variant="body" style={styles.color}>
          {pigeon.color}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    backgroundColor: palette.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 44, // Safe area
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  name: {
    color: 'white',
    marginBottom: 4,
  },
  color: {
    color: 'rgba(255,255,255,0.8)',
  },
});
