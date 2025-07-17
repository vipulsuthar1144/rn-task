import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AppButton from '@/components/ui/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigations/AuthStack';
import { ToastUtils } from '@/utils/toast/toastUtils';
import { useTheme } from '@/config/provider/ThemeProvider';
import { verifyOTP } from '@/services/authService';
import { useUserProvider } from '@/config/provider/UserProvider';
import { generateDummyOTP } from '@/utils/constants';
import { checkPhoneNumberInFirestore } from '@/services/userService';

interface OtpFormValues {
  otp: string;
}

const validationSchema = Yup.object({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .required('OTP is required'),
});

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const OTPScreen = ({ route }: Props) => {
  const { user, confimationMessage } = route.params;
  const { login } = useUserProvider();
  const { theme } = useTheme();

  const [localState, setLocalState] = useState({
    timer: 30,
    resendDisabled: true,
    isLoading: false,
    generatedOTP: '',
  });

  useEffect(() => {
    getOTP();
  }, []);

  const getOTP = () => {
    const otp = generateDummyOTP();
    ToastUtils.show(`Generated OTP :: ${otp}`, 5000);
    setLocalState(prev => ({ ...prev, generatedOTP: otp }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (localState.timer > 0) {
      interval = setInterval(() => {
        setLocalState(prev => ({ ...prev, timer: prev.timer - 1 }));
      }, 1000);
    } else {
      setLocalState(prev => ({ ...prev, resendDisabled: false }));
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [localState.timer]);

  const handleResend = () => {
    // Placeholder — implement actual resend logic here if needed
    getOTP();
    setLocalState({
      ...localState,
      timer: 30,
      resendDisabled: true,
    });
  };

  const handleSubmit = async (values: OtpFormValues) => {
    try {
      setLocalState(prev => ({ ...prev, isLoading: true }));
      // await verifyOTP(confimationMessage, values.otp);
      if (localState.generatedOTP == values.otp.toString()) {
        const userData = await checkPhoneNumberInFirestore(user.phone_number);
        if (userData) {
          login(userData, user.role);
        } else {
          ToastUtils.show('User Not Found');
        }
      } else {
        ToastUtils.show('Invalid OTP');
      }
    } catch (error: any) {
      ToastUtils.show(error.message || 'Something went wrong');
    } finally {
      setLocalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Enter OTP
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
        We sent a 6-digit code to your phone {user.phone_number}
      </Text>

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.text, borderColor: theme.colors.border },
                errors.otp && touched.otp && styles.errorInput,
              ]}
              placeholder="Enter OTP"
              placeholderTextColor={theme.colors.placeholder}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              value={values.otp}
              autoFocus
            />
            {errors.otp && touched.otp && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.otp}
              </Text>
            )}

            <AppButton
              title="Verify OTP"
              loading={isSubmitting || localState.isLoading}
              onPress={handleSubmit}
            />

            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: theme.colors.text }]}>
                Didn't receive code?{' '}
              </Text>
              <TouchableOpacity
                disabled={localState.resendDisabled}
                onPress={handleResend}
              >
                <Text
                  style={[
                    styles.resendBtn,
                    {
                      color: localState.resendDisabled
                        ? theme.colors.disabled
                        : theme.colors.link,
                    },
                  ]}
                >
                  Resend{' '}
                  {localState.resendDisabled ? `in ${localState.timer}s` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 18,
    letterSpacing: 12,
    textAlign: 'center',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
  },
  resendBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
});
