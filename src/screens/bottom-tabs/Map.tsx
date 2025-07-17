// MapScreen.tsx
import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  const latitude = 28.6139; // Replace with user's latitude
  const longitude = 77.209; // Replace with user's longitude

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={userName}
          onPress={openInGoogleMaps}
        />
      </MapView> */}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
