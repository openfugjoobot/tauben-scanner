import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { Icon } from '../../components/atoms/Icon';
import { OfflineBanner } from '../../components/molecules/OfflineBanner';
import { PigeonForm } from './components/PigeonForm';
import { SaveButton } from './components/SaveButton';
import { usePigeonForm } from './hooks/usePigeonForm';
import { useTheme } from '../../theme';

export const NewPigeonScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute();
  const { photoUri } = route.params as { photoUri?: string } || {};

  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    submitError,
    isValid,
    updateField,
    submit,
    resetSubmitStatus,
  } = usePigeonForm({
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
      
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
      >
        <PigeonForm
          formData={formData}
          errors={errors}
          onFieldChange={updateField}
        />

        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.surface }]}>
          <SaveButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            onPress={submit}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
