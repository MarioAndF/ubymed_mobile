import { Stack } from 'expo-router/stack';
import { OrdenConsultaMedicaProvider } from "../../../contexts/ordenes"

export default function Layout() {
  return (
    <OrdenConsultaMedicaProvider>
      <Stack>
        <Stack.Screen name="cliente"/>
        <Stack.Screen name="fecha"/>
        <Stack.Screen name="motivo"/>
        <Stack.Screen name="lugar"/>
        <Stack.Screen name="resumen"/>
      </Stack>
    </OrdenConsultaMedicaProvider>
    
  );
}
