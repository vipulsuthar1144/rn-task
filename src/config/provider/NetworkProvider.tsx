import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useUserProvider } from './UserProvider';
import { syncPendingUpdates } from '@/services/service';
import { ToastUtils } from '@/utils/toast/toastUtils';
import NetInfo from '@react-native-community/netinfo';

const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoggedIn } = useUserProvider();

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }

      if (state.isConnected) {
        ToastUtils.show('Back Online');
        isLoggedIn && syncPendingUpdates();
      } else {
        ToastUtils.show('Offline');
      }
    });

    return () => unsubscribe();
  }, []);

  return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
};

export default NetworkProvider;
