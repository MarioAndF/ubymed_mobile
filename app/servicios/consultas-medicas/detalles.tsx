import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '../../../components/Themed';
import { BottomButton } from '../../../components/Buttons';
import { SimpleTable } from '../../../components/Tables';
// API
import { obtenerUbymedAPI } from '../../../api/ubymed';
// CONTEXTOS
import { useCarritoContext } from '@/contexts/caja'; // Asegúrate de ajustar la ruta de importación

export default function ConsultasDetallesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { nombre, descripcion, descripcion_larga, tiempo_estimado, cobertura, img_url, url, sku } = params;
  const [precio, setPrecio] = useState(""); // Inicializamos el estado del precio como vacío
  const [loading, setLoading] = useState(true); // Manejar el estado de carga
  const [error, setError] = useState(null); // Manejar errores en la API

  const { agregarItem } = useCarritoContext(); // Desestructurar la función agregarItem del contexto

  const loadData = useCallback(() => {
    const url = "catalogo/item/?sku=" + sku;
    obtenerUbymedAPI(url)
      .then((data) => {
        setPrecio(data.precio);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener los servicios:', error);
        setError(error);
        setLoading(false);
      });
  }, [sku]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNext = () => {
    if (sku) {
      agregarItem({ sku, cantidad: 1 }); // Agrega el item al carrito
    }
    router.push('/ordenes/consultas-medicas/crear');
  };

  const data = [
    { title: 'Cobertura', detail: cobertura },
    { title: 'Demora', detail: tiempo_estimado },
    { title: 'Precio', detail: "Q " + precio }, // Mostrar el precio actualizado
  ];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Detalles", headerBackTitleVisible: false }} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          style={styles.image}
          source={{ uri: img_url as string }}
        />
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.description}>{descripcion_larga}</Text>
        <SimpleTable data={data} />
        <Pressable onPress={handleNext}>
          <BottomButton title="Solicitar" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 20, // Añadir espacio al final para asegurar que el botón no esté pegado al borde
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  description: {
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  image: {
    width: '100%',
    height: 250, // Altura fija para evitar que ocupe demasiado espacio vertical
    resizeMode: 'cover',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});