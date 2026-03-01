import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePigeon, useDeletePigeon } from '../../hooks/queries';
import { LoadingState } from '../../components/molecules/LoadingState';
import { ErrorState } from '../../components/molecules/ErrorState';
import { PigeonDetailHeader } from './components/PigeonDetailHeader';
import { PigeonInfoCard } from './components/PigeonInfoCard';
import { SightingsList } from './components/SightingsList';
import { PigeonMap } from './components/PigeonMap';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { useTheme } from "../../theme";

export const PigeonDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useRootNavigation();
  const { pigeonId } = route.params as { pigeonId: string };
  
  const { data: pigeon, isLoading, isError, error, refetch } = usePigeon(pigeonId);
  const deleteMutation = useDeletePigeon();

  const handleEdit = () => {
    navigation.navigate('PigeonEdit', { pigeonId });
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(pigeonId);
      navigation.goBack();
    } catch (err) {
    console.error('Fehler beim Löschen der Taube:', err);
      Alert.alert(
        'Fehler',
        'Die Taube konnte nicht gelöscht werden. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Erneut versuchen', onPress: () => handleDelete() }
        ]
      );
    }
  };

  if (isLoading) {
    return <LoadingState type="detail" />;
  }

  if (isError || !pigeon) {
    return (
      <ErrorState
        title="Fehler beim Laden"
        message={error instanceof Error ? error.message : 'Taube konnte nicht geladen werden.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OfflineBanner />
      
      <ScrollView contentContainerStyle={styles.content}>
        <PigeonDetailHeader
          pigeon={pigeon}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <PigeonInfoCard pigeon={pigeon} />
        
        
        {pigeon.sightings?.length > 0 && (
          <>
            
            <PigeonMap sightings={pigeon.sightings} />
            
            <SightingsList sightings={pigeon.sightings} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
});
