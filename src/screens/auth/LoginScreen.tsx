import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppButton from '@/components/ui/Button';
import { ToastUtils } from '@/utils/toast/toastUtils';
import FormikInput from '@/components/ui/FormikInput';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigations/RootNavigator';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/config/provider/AuthProvider';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const { login } = useAuth();
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login();
      ToastUtils.show('Logged in successfully');
    } catch (error) {
      ToastUtils.show('Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headingWrapper}>
        <Text style={styles.heading}>Welcome Back 👋</Text>
        <Text style={styles.subheading}>Please login to your account</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <FormikInput
              name="email"
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormikInput
              name="password"
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
            />
            <AppButton
              title="Login"
              loading={isSubmitting}
              onPress={handleSubmit}
              buttonStyle={styles.button}
            />
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headingWrapper: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  button: {
    marginTop: 12,
  },
});
