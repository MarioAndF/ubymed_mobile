// LIBRARIES
import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, SectionList, StyleSheet } from "react-native";
import { Stack, Link, useLocalSearchParams } from 'expo-router';
// COMPONENTS
import { Text, View, FlatList, ActivityIndicator  } from '../../../components/Themed';
import { CategoryCard } from '../../../components/Cards';
import { SectionHeader } from '../../../components/SectionHeader';
// TYPES
import { ConsultaMedica } from "../../../types/servicios";
// API
import { obtenerUbymedAPI } from '../../../api/ubymed';

export default function ConsultasScreen() {
  const params = useLocalSearchParams();
  const { nombre, descripcion, descripcion_larga, tiempo_estimado, precio, cobertura, img_url, url } = params;
  const [catalogoConsultas, setCatalogo] = useState<ConsultaMedica[] | null>(null);

  const loadData = useCallback(() => {
    obtenerUbymedAPI(url)
      .then((data) => {
        const serviciosActivos = data
          .filter((servicio: ConsultaMedica) => servicio.active)
          .sort((a: ConsultaMedica, b: ConsultaMedica) => a.sort_index - b.sort_index);
        setCatalogo(serviciosActivos);
      })
      .catch((error) => {
        console.error('Error al obtener los servicios:', error);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: nombre.toString() }} />
      {catalogoConsultas ? (
        <SectionList
        sections={[
          { title: 'Consultas Disponibles', data: catalogoConsultas },
        ]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{
            pathname: "servicios/consultas/detalles",
            params: { nombre: item.nombre, descripcion: item.descripcion, descripcion_larga: item.descripcion_larga, tiempo_estimado: item.tiempo_estimado, precio: item.precio, cobertura: item.cobertura, img_url: item.img_url },
          }} asChild>
            <Pressable>
              <CategoryCard nombre={item.nombre} descripcion={item.descripcion} />
            </Pressable>
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader title={title} />
        )}
      />
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});