import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export async function requestOTP(phoneNumber: string) {
  try {
    const auth = getAuth();
    const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`);
    return confirmation;
  } catch (err) {
    const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;
    throw error;
  }
}
export const verifyOTP = async (
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  otp: string,
) => {
  try {
    const result = await confirmation.confirm(otp);
    return result;
  } catch (error) {
    const err = error as FirebaseAuthTypes.NativeFirebaseAuthError;
    throw err;
  }
};
