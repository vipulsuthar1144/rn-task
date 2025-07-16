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
import { useAuth } from '@/config/provider/AuthProvider';

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
  const { login } = useAuth();
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    setResendDisabled(true);
  };

  const handleSubmit = async (values: OtpFormValues) => {
    try {
      setIsLoading(true);
      await confimationMessage.confirm(values.otp);
      login();
    } catch (error: any) {
      ToastUtils.show(error.message || 'Something wents wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
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
                errors.otp && touched.otp && styles.errorInput,
              ]}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              value={values.otp}
              autoFocus
            />
            {errors.otp && touched.otp && (
              <Text style={styles.errorText}>{errors.otp}</Text>
            )}

            <AppButton
              title="Verify OTP"
              loading={isSubmitting || isLoading}
              onPress={handleSubmit}
              buttonStyle={styles.button}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableOpacity
                disabled={resendDisabled}
                onPress={handleResend}
              >
                <Text
                  style={[
                    styles.resendBtn,
                    resendDisabled && styles.resendBtnDisabled,
                  ]}
                >
                  Resend {resendDisabled ? `in ${timer}s` : ''}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
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
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#444',
  },
  resendBtn: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  },
  resendBtnDisabled: {
    color: '#aaa',
  },
});
