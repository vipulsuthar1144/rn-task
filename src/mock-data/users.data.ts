import { User, UserRole } from '@/schemas/IUserSchema';

export const mockUsers: User[] = [
  {
    id: 'u001',
    name: 'Ravi Kumar',
    phone_number: '9821600992',
    role: UserRole.Plumber,
    tasks: [
      {
        name: 'Fix kitchen sink',
        description: 'Leaking pipe under the sink needs to be replaced.',
        status: 'completed',
        customerName: 'Anjali Mehta',
        customer_phone: '+91 9821600992',
        address: {
          line: '24 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          lat: 19.076,
          lng: 72.8777,
        },
        dateTime: '2025-07-15T10:00:00Z',
        imageUrl: 'https://placehold.co/100x100/plumber1',
      },
    ],
  },
  {
    id: 'u002',
    name: 'Amit Sharma',
    phone_number: '9876543210',
    role: UserRole.Electrician,
    tasks: [
      {
        name: 'Install ceiling fan',
        description: 'Install a ceiling fan with regulator in the living room.',
        status: 'in_progress',
        customerName: 'Vikram Patel',
        customer_phone: '+91 9821600992',
        address: {
          line: '12 Residency Road',
          city: 'Bangalore',
          state: 'Karnataka',
          lat: 12.9716,
          lng: 77.5946,
        },
        dateTime: '2025-07-16T15:30:00Z',
        imageUrl: 'https://placehold.co/100x100/electrician1',
      },
    ],
  },
  {
    id: 'u003',
    name: 'Sunil Verma',
    phone_number: '9876543210',
    role: UserRole.Carpenter,
    tasks: [
      {
        name: 'Build wooden shelf',
        description: 'Create a custom 3-tier wooden shelf for the study room.',
        status: 'pending',
        customerName: 'Priya Kapoor',
        customer_phone: '+91 9821600992',
        address: {
          line: 'Sector 14, HUDA Market',
          city: 'Gurgaon',
          state: 'Haryana',
          lat: 28.4595,
          lng: 77.0266,
        },
        dateTime: '2025-07-18T09:00:00Z',
        imageUrl: 'https://placehold.co/100x100/carpenter1',
      },
    ],
  },
  {
    id: 'u004',
    name: 'Meena Joshi',
    phone_number: '9876543210',
    role: UserRole.Painter,
    tasks: [
      {
        name: 'Paint living room',
        description:
          'Paint the living room walls with two coats of Asian Paints.',
        status: 'completed',
        customer_phone: '+91 9821600992',
        customerName: 'Raj Malhotra',
        address: {
          line: 'Laxmi Nagar, Street 5',
          city: 'Delhi',
          state: 'Delhi',
          lat: 28.6139,
          lng: 77.209,
        },
        dateTime: '2025-07-14T14:00:00Z',
        imageUrl: 'https://placehold.co/100x100/painter1',
      },
    ],
  },
  {
    id: 'u005',
    name: 'Rajeev Nair',
    phone_number: '9876543210',
    role: UserRole.Mechanic,
    tasks: [
      {
        name: 'Car engine service',
        description:
          'Complete diagnostic and service of the car engine, including oil change.',
        status: 'in_progress',
        customerName: 'Sneha Reddy',
        customer_phone: '+91 9821600992',
        address: {
          line: 'Plot 55, Marine Drive',
          city: 'Kochi',
          state: 'Kerala',
          lat: 9.9312,
          lng: 76.2673,
        },
        dateTime: '2025-07-17T11:45:00Z',
        imageUrl: 'https://placehold.co/100x100/mechanic1',
      },
    ],
  },
];
