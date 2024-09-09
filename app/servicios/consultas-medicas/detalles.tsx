import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '../../../components/Themed';
import { BottomButton } from '../../../components/Buttons';
import { SimpleTable } from '../../../components/Tables';
// API
import { obtenerUbymedAPI } from '../../../api/ubymed';

export default function ConsultasDetallesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { nombre, descripcion, descripcion_larga, tiempo_estimado, cobertura, img_url, url, sku } = params;

  const [precio, setPrecio] = useState(""); // Inicializamos el estado del precio como vacío
  const [loading, setLoading] = useState(true); // Manejar el estado de carga
  const [error, setError] = useState(null); // Manejar errores en la API

  useEffect(() => {
    // Función para obtener el precio desde la API
    console.log(sku)
    const url = "catalog/item/?sku=" + sku
    console.log(url)
    const fetchPrecio = async () => {
      try {
        if (url) {
          const response = await obtenerUbymedAPI(url); // Llama a la API con la URL de params
          if (response && response.precio) {
            setPrecio(response.precio); // Actualiza el precio
          }
        }
      } catch (err) {
        console.error("Error fetching precio:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrecio(); // Ejecutar cuando el componente se monta
  }, [url]);

  const handleNext = () => {
    router.push('/ordenes/consultas/fecha');
  };

  // Mostrar un indicador de carga o error si es necesario
  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error al cargar los detalles</Text>
      </View>
    );
  }

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