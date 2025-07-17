import { IUserSchema } from '@/schemas/IUserSchema';
import { getFirestore } from '@react-native-firebase/firestore';

export const checkPhoneNumberInFirestore = async (
  phoneNumber: number | string,
) => {
  try {
    const userSnapshot = await getFirestore()
      .collection('users')
      .where('phone_number', '==', phoneNumber)
      .get();

    if (userSnapshot.empty) {
      return null;
    } else {
      const doc = userSnapshot.docs[0];
      const userData = {
        id: doc.id,
        ...doc.data(),
      } as IUserSchema;
      return userData;
    }
  } catch (error: any) {
    throw error;
  }
};
