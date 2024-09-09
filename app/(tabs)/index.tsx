import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, SectionList, RefreshControl, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
// COMPONENTS
import { Text, FlatList, ActivityIndicator } from '../../components/Themed';
import { SectionHeader } from '../../components/SectionHeader';
import { CategoryCard } from '../../components/Cards';
// TYPES
import { Servicio } from '../../types/servicios';
// API
import { obtenerUbymedAPI } from '../../api/ubymed';

export default function InicioScreen() {
  const [servicios, setServicios] = useState<Servicio[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    obtenerUbymedAPI('servicios')
      .then((data) => {
        const serviciosActivos = data
          .filter((servicio: Servicio) => servicio.active)
          .sort((a: Servicio, b: Servicio) => a.sort_index - b.sort_index);
        setServicios(serviciosActivos);
      })
      .catch((error) => {
        console.error('Error al obtener los servicios:', error);
      });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      {servicios ? (
        <SectionList
          sections={[
            { title: 'Servicios Disponibles', data: servicios },
            //{ title: 'Directorios', data: servicios },
            //{ title: 'Productos', data: servicios },
          ]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={{
              pathname: `/${item.url}`,
              params: { nombre: item.nombre, descripcion: item.descripcion, url: item.url },
            }} asChild>
              <Pressable>
                <CategoryCard nombre={item.nombre} descripcion={item.descripcion} />
              </Pressable>
            </Link>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large"/>
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