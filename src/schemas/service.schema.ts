export type ServiceStatus = 'pending' | 'inProgress' | 'completed' | 'active';

export interface IProviderLocationSchema {
  latitude: number;
  longitude: number;
}

export interface ICustomerSchema {
  name: string;
  phone: string;
  address: string;
}

export interface IServiceSchema {
  id: string;
  title: string;
  image: string;
  price: number;
  status: ServiceStatus;
  providerId: string;
  workerId: string;
  providerLocation: IProviderLocationSchema;
  customer: ICustomerSchema;
}
