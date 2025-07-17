import React, { useEffect, useState } from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TUserRole, UserRole } from '@/schemas/IUserSchema';
import FormikRolePicker from '@/components/ui/FormikRolePicker';
import { AuthStackParamList } from '@/navigations/AuthStack';
import { onAuthStateChanged, getAuth } from '@react-native-firebase/auth';
import { useTheme } from '@/config/provider/ThemeProvider';
import { requestOTP } from '@/services/authService';
import { checkPhoneNumberInFirestore } from '@/services/userService';

interface LoginFormValues {
  phone_number: string;
  role: TUserRole;
}

const validationSchema = Yup.object({
  phone_number: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  role: Yup.mixed<UserRole>().required('Role is required'),
});

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme(); // optional

  const initialValues: LoginFormValues = {
    phone_number: '',
    role: 'carpenter',
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), user => {
      if (user) {
        // Optional: redirect if already logged in
      }
    });
    return subscriber;
  }, []);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      const user = await checkPhoneNumberInFirestore(values.phone_number);
      if (!user) {
        ToastUtils.show('User Not Found');
        return;
      }
      // const confirmation = await requestOTP(values.phone_number);
      ToastUtils.show('OTP Sent');

      navigation.navigate('OTP', {
        user: {
          phone_number: values.phone_number,
          role: values.role,
        },
        // confimationMessage: confirmation,
      });
    } catch (error: any) {
      switch (error.code) {
        case 'auth/invalid-phone-number':
          ToastUtils.show('Invalid phone number format.');
          break;
        case 'auth/missing-phone-number':
          ToastUtils.show('Phone number is required.');
          break;
        case 'auth/quota-exceeded':
          ToastUtils.show('SMS quota exceeded. Try again later.');
          break;
        case 'auth/too-many-requests':
          ToastUtils.show(
            'Too many requests. You’ve been temporarily blocked.',
          );
          break;
        case 'auth/network-request-failed':
          ToastUtils.show('Network error. Check your connection.');
          break;
        default:
          ToastUtils.show(error.message || 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headingWrapper}>
        <Text style={[styles.heading, { color: theme.colors.text }]}>
          Welcome Back 👋
        </Text>
        <Text style={[styles.subheading, { color: theme.colors.subtext }]}>
          Please login to your account
        </Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleSubmit, isSubmitting }) => (
          <>
            <FormikInput
              name="phone_number"
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <FormikRolePicker name="role" label="Select Role" />
            <AppButton
              title="Login"
              loading={isSubmitting || isLoading}
              onPress={handleSubmit}
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
  },
  headingWrapper: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
  },
});
