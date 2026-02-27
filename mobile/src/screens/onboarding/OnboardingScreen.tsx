import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../../components/atoms/Text';
import { Button } from '../../components/atoms/Button';
import { useAppStore } from '../../stores/app';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'pigeon',
    title: 'Willkommen beim Tauben Scanner',
    description: 'Erkenne Tauben mit deiner Kamera und hilf bei der Erfassung und Dokumentation von Brieftauben.',
  },
  {
    id: '2',
    icon: 'camera',
    title: 'Tauben scannen',
    description: 'Nutze die Kamera, um Ringnummern automatisch zu erkennen und neue Tauben zu erfassen.',
  },
  {
    id: '3',
    icon: 'map-marker',
    title: 'Sichtungen tracken',
    description: 'Speichere Fundorte mit GPS-Koordinaten und hilf Taubenzüchtern, ihre Tiere wiederzufinden.',
  },
];

export const OnboardingScreen: React.FC = () => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useAppStore();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
        <MaterialCommunityIcons
          name={item.icon as any}
          size={80}
          color={theme.colors.primary}
        />
      </View>
      <Text variant="h2" style={[styles.title, { color: theme.colors.onBackground }]}>
        {item.title}
      </Text>
      <Text
        variant="bodyLarge"
        style={[styles.description, { color: theme.colors.onBackground + 'CC' }]}
      >
        {item.description}
      </Text>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: theme.colors.primary,
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
          Überspringen
        </Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEnabled={true}
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {renderDots()}

        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
        >
          {currentIndex === slides.length - 1 ? 'Los geht\'s!' : 'Weiter'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    width: '100%',
    maxWidth: 300,
  },
});
