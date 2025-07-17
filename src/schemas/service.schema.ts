import { TUserRole } from './IUserSchema';

export type ServiceStatus = 'pending' | 'inProgress' | 'completed';

export interface IProviderLocationSchema {
  latitude: number;
  longitude: number;
}

export interface ICustomerSchema {
  name: string;
  phone: string;
  address: string;
}

// export interface IServiceSchema {
//   id: string;
//   title: string;
//   image: string;
//   price: number;
//   status: ServiceStatus;
//   providerId: string;
//   workerId: string;
//   providerLocation: IProviderLocationSchema;
//   customer: ICustomerSchema;
// }

export interface IServiceSchema {
  id: string;
  customer_phone_number: string;
  customer_name: string;
  imageUrl: string;
  price: number;
  providerId: string;
  providerLocation: {
    latitude: number;
    longitude: number;
  };
  role: TUserRole;
  status: ServiceStatus;
  title: string;
  // updatedAt: Date; // Or `FirebaseFirestore.Timestamp` if you're using Firestore SDK
  workerId: string;
}
