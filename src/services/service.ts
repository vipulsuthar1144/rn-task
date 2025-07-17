import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  where,
  query,
} from '@react-native-firebase/firestore';
import { IServiceSchema, ServiceStatus } from '@/schemas/service.schema';
import { TUserRole } from '@/schemas/IUserSchema';

// import storage from '@react-native-firebase/storage';
// import { Platform } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';

export const fetchAllServices = async (
  role: TUserRole,
): Promise<IServiceSchema[]> => {
  const db = getFirestore();
  const q = query(collection(db, 'services'), where('role', '==', role));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(
      (service: any) => service.status !== 'completed',
    ) as IServiceSchema[];
};

export const fetchCompletedServicesByWorker = async (
  userId: string,
): Promise<IServiceSchema[]> => {
  const db = getFirestore();

  const q = query(
    collection(db, 'services'),
    where('workerId', '==', userId),
    where('status', '==', 'completed'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  })) as IServiceSchema[];
};

export const updateServiceStatus = async (
  id: string,
  nextStatus: ServiceStatus,
) => {
  const db = getFirestore();
  await updateDoc(doc(db, 'services', id), { status: nextStatus });
};

// export const uploadImageToFirebase = async (uri: string): Promise<string> => {
//   const filename = `${uuidv4()}.jpg`;
//   const reference = storage().ref(`service-images/${filename}`);

//   const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
//   await reference.putFile(uploadUri);

//   return await reference.getDownloadURL();
// };
