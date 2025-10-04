import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Text, TextInput, Button, Title, Paragraph} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {useAuth} from '../../contexts/AuthContext';
import {useTheme} from '../../contexts/ThemeContext';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
}

const RegisterScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {register} = useAuth();
  const {theme} = useTheme();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
      });
      Toast.show({
        type: 'success',
        text1: 'Account Created!',
        text2: 'Welcome to AI Credit Optimizer!',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || 'Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Title style={[styles.title, {color: theme.colors.text}]}>
            Create Account
          </Title>
          <Paragraph style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            Join thousands of users optimizing their credit health
          </Paragraph>
        </View>

        <View style={styles.form}>
          <View style={styles.nameRow}>
            <Controller
              control={control}
              name="firstName"
              rules={{
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label="First Name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  autoCapitalize="words"
                  error={!!errors.firstName}
                  style={[styles.input, styles.halfInput]}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      error: theme.colors.error,
                    },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              rules={{
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label="Last Name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  autoCapitalize="words"
                  error={!!errors.lastName}
                  style={[styles.input, styles.halfInput]}
                  theme={{
                    colors: {
                      primary: theme.colors.primary,
                      error: theme.colors.error,
                    },
                  }}
                />
              )}
            />
          </View>

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

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                error={!!errors.password}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    error: theme.colors.error,
                  },
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                autoComplete="password-new"
                error={!!errors.confirmPassword}
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    error: theme.colors.error,
                  },
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            rules={{
              required: 'Date of birth is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                label="Date of Birth"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                mode="outlined"
                placeholder="MM/DD/YYYY"
                keyboardType="numeric"
                error={!!errors.dateOfBirth}
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

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.registerButton, {backgroundColor: theme.colors.primary}]}
            contentStyle={styles.registerButtonContent}>
            Create Account
          </Button>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, {color: theme.colors.textSecondary}]}>
              Already have an account?{' '}
            </Text>
            <Button
              mode="text"
              onPress={handleLogin}
              labelStyle={[styles.loginButtonText, {color: theme.colors.primary}]}>
              Sign In
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginButtonText: {
    fontSize: 14,
  },
});

export default RegisterScreen;

