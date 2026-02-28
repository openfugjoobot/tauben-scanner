import React from 'react';
import { View, StyleSheet, TouchableOpacity, Share, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../../../components/atoms/Text';
import { Icon } from '../../../components/atoms/Icon';
import { useTheme } from '../../../theme';
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
  const theme = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {pigeon.photoUrl ? (
        <Image source={{ uri: pigeon.photoUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder, { backgroundColor: theme.colors.surface }]}>
          <Icon name="bird" size={80} color={theme.colors.onSurfaceVariant} />
        </View>
      )}

      <View style={[styles.overlay, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface + '4D' }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface + '4D' }]} onPress={handleShare}>
            <Icon name="share-variant" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface + '4D' }]} onPress={onEdit}>
            <Icon name="pencil" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface + '4D' }]} onPress={confirmDelete}>
            <Icon name="trash-can" size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.infoContainer, { backgroundColor: theme.colors.background + '66' }]}>
        <Text variant="h1" style={[styles.name, { color: theme.colors.onSurface }]}>
          {pigeon.name}
        </Text>
        <Text variant="body" style={[styles.color, { color: theme.colors.onSurfaceVariant }]}>
          {pigeon.color}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
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
  },
  name: {
    marginBottom: 4,
  },
  color: {
    // color handled inline
  },
});
