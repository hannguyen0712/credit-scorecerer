import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {Text, Button, Title, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useTheme} from '../../contexts/ThemeContext';

const {width, height} = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'AI-Powered Credit Optimization',
    description: 'Get personalized recommendations to improve your credit score using advanced AI algorithms.',
    icon: 'psychology',
    color: '#2E7D32',
  },
  {
    id: 2,
    title: 'Smart Payment Strategies',
    description: 'Never miss a payment with intelligent reminders and optimal payment timing suggestions.',
    icon: 'schedule',
    color: '#4CAF50',
  },
  {
    id: 3,
    title: 'Real-time Spending Analysis',
    description: 'Track your spending patterns and get insights to maximize rewards and minimize interest.',
    icon: 'analytics',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'Financial Education',
    description: 'Learn about credit health, financial planning, and smart money management.',
    icon: 'school',
    color: '#2196F3',
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {theme} = useTheme();
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login' as never);
  };

  const currentSlideData = onboardingSlides[currentSlide];

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Skip Button */}
        <Button
          mode="text"
          onPress={handleSkip}
          style={styles.skipButton}
          labelStyle={[styles.skipButtonText, {color: theme.colors.textSecondary}]}>
          Skip
        </Button>

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          <View style={[styles.iconContainer, {backgroundColor: currentSlideData.color + '20'}]}>
            <Icon
              name={currentSlideData.icon}
              size={80}
              color={currentSlideData.color}
            />
          </View>

          <Title style={[styles.title, {color: theme.colors.text}]}>
            {currentSlideData.title}
          </Title>

          <Paragraph style={[styles.description, {color: theme.colors.textSecondary}]}>
            {currentSlideData.description}
          </Paragraph>
        </View>

        {/* Progress Indicators */}
        <View style={styles.progressContainer}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index === currentSlide
                    ? currentSlideData.color
                    : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomContainer, {backgroundColor: theme.colors.surface}]}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.nextButton, {backgroundColor: currentSlideData.color}]}
          contentStyle={styles.nextButtonContent}>
          {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  nextButton: {
    borderRadius: 12,
  },
  nextButtonContent: {
    paddingVertical: 8,
  },
});

export default OnboardingScreen;

