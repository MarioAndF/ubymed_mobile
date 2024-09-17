// LIBRARIES
import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";

// COMPONENTS
import { View } from "@/components/Themed";
import { HeaderText } from "@/components/StyledText";
import { SingleSelectTable, EditableTable } from "@/components/Tables";
import { BottomButton } from "@/components/Buttons";

// CONTEXTS
import { useOrdenConsultaMedicaContext } from "@/contexts/ordenes";

// TYPES
import { OrdenConsultaMedica } from "@/types/ordenes";

export default function ClienteScreen() {
  const router = useRouter(); // Hook para la navegación programática
  const { ordenConsultaMedicaData, updateOrdenConsultaMedicaData } =
    useOrdenConsultaMedicaContext();
  const [selectedRow, setSelectedRow] = React.useState<
    { label: string; value: string }[] | null
  >(null);

  // Definir los campos relevantes y sus etiquetas personalizadas
  const relevantFields = {
    paciente_nombre: "Nombre",
    paciente_apellido: "Apellido",
    paciente_telefono: "Teléfono",
  };

  // Datos de ejemplo para la tabla
  const data = [
    { id: "0", name: "Para mi" },
    { id: "1", name: "Para otra persona" },
    // Agrega más opciones aquí si es necesario
  ];

  const example_user = {
    paciente_nombre: "Mario",
    paciente_apellido: "Flores",
    paciente_telefono: "4008-4336",
  };

  // Cargar datos desde el contexto al abrir la pantalla, solo nombre, apellido y telefono
  useEffect(() => {
    if (ordenConsultaMedicaData) {
      const initialData = Object.entries(ordenConsultaMedicaData)
        .filter(([key]) => Object.keys(relevantFields).includes(key)) // Filtra solo los campos que queremos
        .map(([key, value]) => ({
          label: relevantFields[key as keyof typeof relevantFields],
          value: value as string,
        }));
      setSelectedRow(initialData);
    }
  }, [ordenConsultaMedicaData]);

  const handleRowSelect = (id: string) => {
    if (id === "0") {
      // Si se selecciona "Para mi", cargar example_user
      const selectedRow = Object.entries(example_user).map(([key, value]) => ({
        label: relevantFields[key as keyof typeof relevantFields],
        value: value,
      }));
      setSelectedRow(selectedRow);
    } else {
      // Si se selecciona "Para otra persona", mantener la tabla editable visible con datos vacíos
      const emptyRow = Object.keys(relevantFields).map((field) => ({
        label: relevantFields[field as keyof typeof relevantFields],
        value: "",
      }));
      setSelectedRow(emptyRow);
    }
  };

  const handleDataChange = (
    updatedData: { label: string; value: string }[]
  ) => {
    setSelectedRow(updatedData);
  };

  // Función para manejar el avance a la siguiente pantalla
  const handleNext = () => {
    if (selectedRow) {
      const updatedData = selectedRow.reduce((acc, { label, value }) => {
        // Encuentra la clave correspondiente para el label
        const key = Object.keys(relevantFields).find(
          (k) => relevantFields[k as keyof typeof relevantFields] === label
        );
        if (key) {
          acc[key as keyof OrdenConsultaMedica] = value;
        }
        return acc;
      }, {} as Partial<OrdenConsultaMedica>);
      updateOrdenConsultaMedicaData(updatedData);
      router.push("/ordenes/consultas-medicas/crear/motivo"); // Navegar a la siguiente pantalla
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Paciente" }} />
      <HeaderText>¿Para quién es la consulta?</HeaderText>
      <SingleSelectTable data={data} onRowSelect={handleRowSelect} />
      <EditableTable data={selectedRow || []} onDataChange={handleDataChange} />
      <Pressable onPress={handleNext}>
        <BottomButton title="Siguiente" />
      </Pressable>
    </View>
  );
}
