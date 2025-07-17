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
  fetchAllServices,
  fetchCompletedServicesByWorker,
  updateServiceStatus,
} from '@/services/service';
import { STATUS_OPTIONS } from '@/utils/constants';
import { useTheme } from '@/config/provider/ThemeProvider';
import { useUserProvider } from '@/config/provider/UserProvider';

const HistoryScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserProvider();

  const [data, setData] = useState<{
    loading: boolean;
    refreshing: boolean;
    error: string;
    services: IServiceSchema[];
  }>({
    loading: false,
    refreshing: false,
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
      const services = await fetchCompletedServicesByWorker(user?.id ?? '');
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
  }, [fetchServices]);

  const onRefresh = () => fetchServices(true);

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
        <View style={[styles.statusBadge]}>
          <Text style={[styles.statusText, { color: theme.colors.text }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Customer:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {item.customer?.name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Phone:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {item.customer?.phone}
          </Text>
        </View>
      </Card.Content>
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
      ) : data.services.length === 0 ? (
        <View style={styles.center}>
          <Text>No services found.</Text>
        </View>
      ) : (
        <FlatList
          data={data.services}
          keyExtractor={item => item.id}
          renderItem={renderItem}
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

export default HistoryScreen;

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
