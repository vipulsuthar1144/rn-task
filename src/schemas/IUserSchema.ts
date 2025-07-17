export interface IUserSchema {
  id?: string;
  name?: string;
  phone_number: string;
  role: TUserRole;
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
