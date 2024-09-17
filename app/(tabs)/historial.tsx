import React, { useState, useEffect, useCallback } from "react";
import {
  SectionList,
  RefreshControl,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Text
} from "react-native";
import { useRouter } from 'expo-router';
// COMPONENTS
import { SectionHeader } from "@/components/SectionHeader";
import { SimpleCard } from "@/components/Cards";
// TYPES
import { Servicio } from "@/types/servicios";
// API
import { obtenerUbymedAPI } from "@/api/ubymed";

export default function InicioScreen() {
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<Servicio[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    obtenerUbymedAPI("ordenes")
      .then((data) => {
        // Ordenar los datos por id en orden descendente
        const ordenesData = data.sort((a, b) => b.id - a.id);
        setOrdenes(ordenesData);
      })
      .catch((error) => {
        console.error("Error al obtener las ordenes:", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCardPress = (id: number) => {
    router.push(`ordenes/consultas-medicas?id=${id}`)
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay órdenes disponibles.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {ordenes ? (
        <SectionList
          sections={[
            { title: "Órdenes", data: ordenes },
          ]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SimpleCard
              text={`ID: ${item.id}\nCreada: ${item.created_at}\nTipo: ${item.contenido_tipo}\nEstado: ${item.estado}`}
              onPress={() => handleCardPress(item.id)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionHeader title={title} />
          )}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
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
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});