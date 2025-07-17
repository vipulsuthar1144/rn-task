import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  where,
  query,
  addDoc,
  orderBy,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { IServiceSchema, ServiceStatus } from '@/schemas/service.schema';
import { TUserRole } from '@/schemas/IUserSchema';

import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAllServices = async (
  role: TUserRole,
): Promise<IServiceSchema[]> => {
  const db = getFirestore();
  const q = query(
    collection(db, 'services'),
    where('role', '==', role),
    // orderBy('createdAt', 'desc'),
  );
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

export const addMultipleServices = async () => {
  const services = mockServices;
  const db = getFirestore();
  const servicesRef = collection(db, 'services');

  // const added = [];

  for (const service of services) {
    const docRef = await addDoc(servicesRef, service);
    // added.push({ id: docRef.id, ...service });
  }

  // return added;
};
export const mockServices: {
  customer_phone_number: string;
  customer_name: string;
  price: number;
  providerLocation: {
    latitude: number;
    longitude: number;
  };
  role: TUserRole;
  status: ServiceStatus;
  title: string;
}[] = Array.from({ length: 50 }, (_, i) => {
  const roles: TUserRole[] = [
    'plumber',
    'electrician',
    'carpenter',
    'painter',
    'mechanic',
  ];
  const role = roles[i % roles.length];

  const customerNames = [
    'Aarav Mehta',
    'Saanvi Sharma',
    'Vivaan Patel',
    'Diya Reddy',
    'Kabir Nair',
    'Ishaan Gupta',
    'Anaya Verma',
    'Aditya Singh',
    'Myra Joshi',
    'Arjun Kapoor',
    'Kiara Desai',
    'Atharv Bansal',
    'Aarya Iyer',
    'Shaurya Rao',
    'Tara Pillai',
  ];
  const customer_name = customerNames[i % customerNames.length];

  const latitude = parseFloat((20 + Math.random() * 10).toFixed(4));
  const longitude = parseFloat((70 + Math.random() * 10).toFixed(4));

  return {
    customer_phone_number: `98765${String(10000 + i).slice(-5)}`,
    customer_name,
    price: 100 + Math.floor(Math.random() * 500),
    providerLocation: {
      latitude,
      longitude,
    },
    role,
    status: 'pending',
    title: `${role.charAt(0).toUpperCase() + role.slice(1)} Work`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
});

export const fetchCompletedServicesByWorker = async (
  userId: string,
  role: TUserRole,
): Promise<IServiceSchema[]> => {
  const db = getFirestore();

  const q = query(
    collection(db, 'services'),
    where('workerId', '==', userId),
    where('role', '==', role),
    // orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  })) as IServiceSchema[];
};

// export const updateServiceStatus = async (
//   id: string,
//   nextStatus: ServiceStatus,
// ) => {
//   const db = getFirestore();
//   await updateDoc(doc(db, 'services', id), { status: nextStatus });
// };

export const updateServiceStatus = async (
  id: string,
  nextStatus: ServiceStatus,
  imageUrl?: string,
  workerId?: string,
) => {
  const updateData: any = {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  };

  if (imageUrl) updateData.imageUrl = imageUrl;
  if (workerId) updateData.workerId = workerId;

  await updateDoc(doc(getFirestore(), 'services', id), updateData);
};

export const uploadImageToFirebase = async (uri: string): Promise<string> => {
  const filename = `${uuidv4()}.jpg`;
  const reference = storage().ref(`service-images/${filename}`);

  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  await reference.putFile(uploadUri);

  return await reference.getDownloadURL();
};

export const savePendingUpdate = async (update: any) => {
  const existing = await AsyncStorage.getItem('pendingServiceUpdates');
  const queue = existing ? JSON.parse(existing) : [];
  queue.push(update);
  await AsyncStorage.setItem('pendingServiceUpdates', JSON.stringify(queue));
};

export const syncPendingUpdates = async () => {
  const data = await AsyncStorage.getItem('pendingServiceUpdates');
  if (!data) return;

  const updates = JSON.parse(data);

  const remaining = [];

  for (const update of updates) {
    try {
      const imageUrl = await uploadImageToFirebase(update.imageUri);
      await updateServiceStatus(
        update.serviceId,
        update.nextStatus,
        imageUrl,
        update.workerId,
      );
    } catch {
      remaining.push(update);
    }
  }

  await AsyncStorage.setItem(
    'pendingServiceUpdates',
    JSON.stringify(remaining),
  );
};
