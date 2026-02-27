import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { PigeonForm } from './components/PigeonForm';
import { usePigeonForm } from './hooks/usePigeonForm';
import { useTheme } from '../../theme';

export const NewPigeonScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { photoUri } = route.params as { photoUri?: string } || {};
  
  const { formData, errors, isSubmitting, updateField, submit } = usePigeonForm({
    photo: photoUri || null,
  });

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text variant="h1">Neue Taube</Text>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          <Text variant="body" color={theme.colors.onSurfaceVariant}>
            Geben Sie die Details der Taube ein.
          </Text>
        </View>
        
        <PigeonForm
          formData={formData}
          errors={errors}
          onFieldChange={updateField}
        />
        
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            size="large"
            loading={isSubmitting}
            onPress={submit}
            style={styles.saveButton}
          >
            Speichern
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  closeButton: {
    padding: 8,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    width: '100%',
  },
});
