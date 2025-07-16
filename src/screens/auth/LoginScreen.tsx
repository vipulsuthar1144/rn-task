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
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigations/RootNavigator';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/config/provider/AuthProvider';
import { UserRole } from '@/schemas/IUserSchema';
import FormikRolePicker from '@/components/ui/FormikRolePicker';
import { AuthStackParamList } from '@/navigations/AuthStack';
// import { getAuth } from '@/config/firebase/firebase.config';
import auth from '@react-native-firebase/auth';
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
} from '@react-native-firebase/auth';

interface LoginFormValues {
  name: string;
  phone_number: string;
  role: UserRole;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone_number: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  role: Yup.mixed<UserRole>()
    .oneOf(Object.values(UserRole), 'Select a valid role')
    .required('Role is required'),
});

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const initialValues: LoginFormValues = {
    name: '',
    phone_number: '',
    role: UserRole.Plumber,
  };

  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // Handle login
  function handleAuthStateChanged(user: any) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function handleSignInWithPhoneNumber(phoneNumber: string) {
    console.log('calling :: ');
    try {
      const auth = getAuth();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      console.log('calling :: ' + confirmation);
      setConfirm(confirmation);
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
    }
  }

  const handleLogin = async (values: LoginFormValues) => {
    try {
      navigation.navigate('OTP', {
        user: {
          name: values.name,
          phone_number: values.phone_number,
          role: values.role,
        },
      });
      ToastUtils.show('OTP Send');
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
              name="name"
              label="Name"
              placeholder="Enter your full name"
            />
            <FormikInput
              name="phone_number"
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            <FormikRolePicker name="role" label="Select Role" />
            <AppButton
              title="Login"
              loading={isSubmitting}
              onPress={handleSubmit}
              buttonStyle={styles.button}
            />
          </>
        )}
      </Formik>
      <AppButton
        title="Login"
        onPress={() => handleSignInWithPhoneNumber('+91 8949441607')}
        buttonStyle={styles.button}
      />
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
