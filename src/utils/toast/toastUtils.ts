import Toast, { ToastType } from 'react-native-toast-message';

export const ToastUtils = {
  show: (message: string) => {
    Toast.show({
      type: 'info',
      text1: message,
      position: 'bottom',
      visibilityTime: 1500,
      autoHide: true,
      topOffset: 50,
    });
  },
};
