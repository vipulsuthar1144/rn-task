export const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'inProgress' },
  { label: 'Completed', value: 'completed' },
] as const;

export const generateDummyOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
