import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { IServiceSchema, ServiceStatus } from '@/schemas/service.schema';
import {
  addMultipleServices,
  fetchAllServices,
  savePendingUpdate,
  updateServiceStatus,
  uploadImageToFirebase,
} from '@/services/service';
import { STATUS_OPTIONS } from '@/utils/constants';
import { useTheme } from '@/config/provider/ThemeProvider';
import MapScreen from './Map';
import { useUserProvider } from '@/config/provider/UserProvider';
import { pickImage } from '@/utils/UtilityImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastUtils } from '@/utils/toast/toastUtils';
import NetInfo from '@react-native-community/netinfo';
import { TUserRole } from '@/schemas/IUserSchema';
import { BottomTabParamList } from '@/navigations/BottomTabs';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<BottomTabParamList, 'Home'>;
const ServicesScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const { selectedRole, user } = useUserProvider();

  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

  const [data, setData] = useState<{
    loading: boolean;
    refreshing: boolean;
    uploadImageLoading: boolean;
    error: string;
    services: IServiceSchema[];
  }>({
    loading: false,
    refreshing: false,
    uploadImageLoading: false,
    error: '',
    services: [],
  });

  const fetchServices = useCallback(async (isRefreshing = false) => {
    setData(prev => ({
      ...prev,
      loading: !isRefreshing,
      refreshing: isRefreshing,
      error: '',
    }));

    try {
      const services = await fetchAllServices(selectedRole);
      setData(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        services,
        error: '',
      }));
    } catch (err) {
      console.error('Error fetching services:', err);
      setData(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: 'Failed to load services.',
      }));
    }
  }, []);

  useEffect(() => {
    fetchServices();
    // addMultipleServices();
  }, [fetchServices]);

  const onRefresh = () => fetchServices(true);

  const onUpdateStatus = async (service: IServiceSchema) => {
    const nextStatus: ServiceStatus = 'completed';

    setUploadingIds(prev => new Set(prev).add(service.id));

    try {
      const imageUri = await pickImage();
      const { isConnected } = await NetInfo.fetch();

      if (!isConnected) {
        await savePendingUpdate({
          serviceId: service.id,
          nextStatus,
          imageUri,
          workerId: user?.id ?? '',
        });
        ToastUtils.show('No internet. Status update saved locally.');
        return;
      }

      const imageUrl = await uploadImageToFirebase(imageUri ?? '');
      await updateServiceStatus(
        service.id,
        nextStatus,
        imageUrl,
        user?.id ?? '',
      );

      fetchServices();
      navigation.navigate('History', { recall: true });
    } catch (err: any) {
      ToastUtils.show(err?.message || 'Something went wrong');
      // console.error('Status update failed:', err);
    } finally {
      setUploadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(service.id);
        return newSet;
      });
    }
  };

  const renderItem = ({ item }: { item: IServiceSchema }) => (
    <Card
      style={[
        styles.card,
        { backgroundColor: theme.dark ? '#94A3B8' : '#fff' },
      ]}
      elevation={3}
    >
      <Card.Title
        title={item.title}
        subtitle={`₹${item.price}`}
        titleStyle={[styles.cardTitle, { color: theme.colors.text }]}
        subtitleStyle={[styles.cardSubtitle, { color: theme.colors.text }]}
      />
      <Card.Content>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Status:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {item?.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Customer:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {item?.customer_name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Phone:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {item?.customer_phone_number}
          </Text>
        </View>
        <MapScreen />
      </Card.Content>

      <Card.Actions style={styles.actions}>
        {item.status !== 'completed' && (
          <Button
            mode="contained"
            onPress={() => onUpdateStatus(item)}
            style={styles.statusButton}
            labelStyle={{ fontWeight: 'bold' }}
            disabled={uploadingIds.has(item.id)}
          >
            {uploadingIds.has(item.id) ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: '#fff' }}>
                {item.status === 'pending' ? 'Start Work' : 'Completed'}
              </Text>
            )}
          </Button>
        )}
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {data.loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Loading services...</Text>
        </View>
      ) : data.error ? (
        <View style={styles.center}>
          <Text style={{ color: 'red' }}>{data.error}</Text>
          <Button onPress={() => fetchServices()}>Retry</Button>
        </View>
      ) : (
        <FlatList
          data={data.services}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text>No services found.</Text>
            </View>
          }
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={data.refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  filterWrapper: {
    paddingTop: 12,
    paddingBottom: 4,
    minHeight: 60, // or exact height if needed
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  status_pending: {
    backgroundColor: '#fff3cd',
  },
  status_inProgress: {
    backgroundColor: '#cce5ff',
  },
  status_completed: {
    backgroundColor: '#d4edda',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  label: {
    fontWeight: '600',
    // color: '#444',
    width: 90,
  },
  value: {
    flex: 1,
    // color: '#555',
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 12,
    paddingBottom: 8,
  },
  statusButton: {
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 8,
    marginVertical: 12,
  },
  map: {
    height: 180,
    marginTop: 10,
    borderRadius: 8,
  },
});
