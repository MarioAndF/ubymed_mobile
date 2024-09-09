import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Pressable, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Text, View } from '../../../components/Themed';
import { HeaderText } from '../../../components/StyledText';
import { BottomButton } from '../../../components/Buttons';
import { TextField } from '../../../components/TextFields';
import { useOrdenConsultaMedicaContext } from '@/contexts/ordenes';
import debounce from 'lodash/debounce'; // Usando lodash.debounce

const parseGeoPoint = (geoString: string) => {
  const match = geoString.match(/POINT \(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const [, longitude, latitude] = match;
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
  }
  return null;
};

export default function LugarScreen() {
  const router = useRouter();
  const { ordenConsultaMedicaData, updateOrdenConsultaMedicaData } = useOrdenConsultaMedicaContext();
  
  const [direccion, setDireccion] = useState('');
  const [mapPosition, setMapPosition] = useState({
    latitude: 14.6349, // Ciudad de Guatemala - Default value
    longitude: -90.5069, // Ciudad de Guatemala - Default value
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const mapRef = useRef<MapView>(null); // Reference to the MapView

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setLocationLoaded(true);
        } else {
          Alert.alert('Permiso de ubicación necesario', 'Por favor, habilita los permisos de ubicación.');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (ordenConsultaMedicaData.direccion) {
      setDireccion(ordenConsultaMedicaData.direccion);
    }
    if (ordenConsultaMedicaData.geolocalizacion) {
      const parsedPosition = parseGeoPoint(ordenConsultaMedicaData.geolocalizacion);
      if (parsedPosition) {
        setMapPosition(parsedPosition);
      }
    }
  }, [ordenConsultaMedicaData]);

  useEffect(() => {
    if (locationLoaded && userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 300);
      setMapPosition(userLocation); // Update the pin position
    }
  }, [locationLoaded, userLocation]);

  const handleDireccionChange = (text: string) => {
    setDireccion(text);
  };

  const handleRegionChange = (region: Region) => {
    // Directly update the mapPosition based on the current map region
    setMapPosition({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const handleRegionChangeComplete = debounce((region: Region) => {
    // Optionally handle final region change if needed
  }, 100);

  const handleNext = () => {
    updateOrdenConsultaMedicaData({
      direccion,
      geolocalizacion: `POINT (${mapPosition.longitude} ${mapPosition.latitude})`,
    });
    router.push('/ordenes/consultas/resumen');
  };

  // Determine initial region based on user location or default map position
  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: mapPosition.latitude,
    longitude: mapPosition.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Stack.Screen options={{ title: "Lugar" }} />
        <MapView
          style={{ flex: 1 }}
          ref={mapRef}
          initialRegion={initialRegion}
          onRegionChange={handleRegionChange} // Real-time updates for pin position
          onRegionChangeComplete={handleRegionChangeComplete} // Optional
          showsUserLocation={true}
          followsUserLocation={false}
        >
          <Marker
            coordinate={mapPosition}
            draggable
            onDragEnd={(e) => setMapPosition(e.nativeEvent.coordinate)}
          />
        </MapView>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <HeaderText>¿A dónde nos dirigimos?</HeaderText>
          <TextField
            placeholder="Dirección"
            value={direccion}
            onChangeText={handleDireccionChange}
          />
          <Pressable onPress={handleNext}>
            <BottomButton title="Siguiente" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}