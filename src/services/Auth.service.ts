import { mockUsers } from '@/mock-data/users.data';

export const checkUserExists = (phone: string) => {
  return mockUsers.find(user => user.phone_number === phone);
};

export const sendOtp = async (phone: string) => {
  try {
    const response = await fetch('https://your-api.com/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};
