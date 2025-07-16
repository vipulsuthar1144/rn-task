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
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';

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
  const initialValues: LoginFormValues = {
    phone_number: '',
    role: 'carpenter',
  };

  function handleAuthStateChanged(user: any) {
    if (user) {
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function handleSignInWithPhoneNumber(values: LoginFormValues) {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(
        auth,
        values.phone_number,
      );
      ToastUtils.show('OTP Sent');
      navigation.navigate('OTP', {
        user: {
          phone_number: values.phone_number,
          role: values.role,
        },
        confimationMessage: confirmation,
      });
    } catch (err: any) {
      console.log(err);

      const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;

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
            'Too many requests. You’ve been temporarily blocked. Try again later.',
          );
          break;
        case 'auth/network-request-failed':
          ToastUtils.show(
            'Network error. Please check your internet connection.',
          );
          break;
        case 'auth/user-disabled':
          ToastUtils.show('This user has been disabled.');
          break;
        case 'auth/app-not-authorized':
          ToastUtils.show(
            'App is not authorized to use Firebase Authentication.',
          );
          break;
        case 'auth/captcha-check-failed':
          ToastUtils.show('CAPTCHA check failed. Please try again.');
          break;
        case 'auth/invalid-verification-code':
          ToastUtils.show('The OTP you entered is invalid.');
          break;
        case 'auth/session-expired':
          ToastUtils.show('Your session has expired. Please resend OTP.');
          break;
        default:
          ToastUtils.show(
            error.message || 'Something went wrong. Please try again.',
          );
          break;
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogin = async (values: LoginFormValues) => {
    try {
      handleSignInWithPhoneNumber(values);
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
