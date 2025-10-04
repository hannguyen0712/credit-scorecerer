import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, TextInput, Button, Title, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const {forgotPassword} = useAuth();
  const {theme} = useTheme();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await forgotPassword(data.email);
      setIsEmailSent(true);
      Toast.show({
        type: 'success',
        text1: 'Reset Email Sent',
        text2: 'Please check your email for password reset instructions.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Email',
        text2: error.message || 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  if (isEmailSent) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.content}>
          <Title style={[styles.title, {color: theme.colors.text}]}>
            Check Your Email
          </Title>
          <Paragraph style={[styles.description, {color: theme.colors.textSecondary}]}>
            We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
          </Paragraph>
          <Button
            mode="contained"
            onPress={handleBackToLogin}
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            contentStyle={styles.buttonContent}>
            Back to Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Title style={[styles.title, {color: theme.colors.text}]}>
            Forgot Password?
          </Title>
          <Paragraph style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Paragraph>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Email"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={!!errors.email}
                style={styles.input}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    error: theme.colors.error,
                  },
                }}
              />
            )}
          />
          {errors.email && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {errors.email.message}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            contentStyle={styles.buttonContent}>
            Send Reset Instructions
          </Button>

          <Button
            mode="text"
            onPress={handleBackToLogin}
            labelStyle={[styles.backButtonText, {color: theme.colors.primary}]}>
            Back to Login
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  button: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;

