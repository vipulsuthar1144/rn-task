export interface IUserSchema {
  phone_number: string;
  role: TUserRole;
}

export interface Task {
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  customerName: string;
  customer_phone: string;
  address: {
    line: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  dateTime: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: TUserRole;
  tasks: Task[];
}

export type TUserRole =
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'painter'
  | 'mechanic';

export enum UserRole {
  Plumber = 'plumber',
  Electrician = 'electrician',
  Carpenter = 'carpenter',
  Painter = 'painter',
  Mechanic = 'mechanic',
}
