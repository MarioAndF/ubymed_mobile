import { Stack } from "expo-router/stack";
import { OrdenConsultaMedicaProvider } from "@/contexts/ordenes";

export default function CrearConsultaMedicaLayout() {
  return (
    <OrdenConsultaMedicaProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="cliente" />
        <Stack.Screen name="motivo" />
        <Stack.Screen name="lugar" />
        <Stack.Screen name="confirmar" />
      </Stack>
    </OrdenConsultaMedicaProvider>
  );
}
