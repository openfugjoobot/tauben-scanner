import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
  
  const { formData, errors, isSubmitting, submitStatus, submitError, updateField, submit, resetSubmitStatus } = usePigeonForm({
    photo: photoUri || null,
  });

  const showErrorBanner = submitStatus === 'error' && submitError;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OfflineBanner />
      
      {showErrorBanner && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.error }]}>
          <Icon name="alert-circle" size={20} color={theme.colors.onError} />
          <Text variant="body" style={[styles.errorBannerText, { color: theme.colors.onError }]}>
            {submitError}
          </Text>
          <Button
            variant="ghost"
            size="small"
            onPress={resetSubmitStatus}
            style={styles.errorBannerDismiss}
          >
            <Icon name="close" size={16} color={theme.colors.onError} />
          </Button>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          <Text variant="h1">Neue Taube</Text>
          <Text variant="body" color={theme.colors.onSurfaceVariant}>
            Geben Sie die Details der Taube ein.
          </Text>
        </View>
        
        <PigeonForm
          formData={formData}
          errors={errors}
          onFieldChange={updateField}
        />
        
        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.surface }]}>
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
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  saveButton: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  errorBannerText: {
    flex: 1,
    fontWeight: '500',
  },
  errorBannerDismiss: {
    padding: 0,
    minWidth: 0,
  },
});
