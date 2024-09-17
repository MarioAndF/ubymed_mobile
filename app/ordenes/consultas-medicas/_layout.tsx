import { Stack } from "expo-router/stack";

export default function ConsultaMedicaLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="crear" options={{ headerShown: false }}/>
    </Stack>
  );
}
