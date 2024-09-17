import React, { useState, useEffect } from "react";
import { Pressable, SectionList, Alert } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SectionHeader } from "@/components/SectionHeader";
import { BottomButton } from "@/components/Buttons";
import { SimpleTable, EditableTable } from "@/components/Tables";
import { obtenerUbymedAPI } from "@/api/ubymed"; // Asegúrate de que la ruta sea correcta
import { useCarritoContext } from "@/contexts/caja"; // Asegúrate de ajustar la ruta de importación
import { format } from "date-fns";

export default function OrdenConsultaMedicaScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const [ordenData, setOrdenData] = useState({});
  const [ordenConsultaMedicaData, setOrdenConsultaMedicaData] = useState({});

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Obtener los detalles de la orden
          const orden = await obtenerUbymedAPI(`ordenes/${id}`);
          const formattedDate = format(
            new Date(orden.created_at),
            "dd/MM/yyyy HH:mm"
          );
          setOrdenData({
            id: id,
            createdAt: formattedDate,
            contentType: orden.contenido_tipo,
            estado: orden.estado,
          });

          // Obtener los ítems del carrito
          const ordenConsultaMedica = await obtenerUbymedAPI(
            `ordenes/consultas-medicas?orden_id=${id}`
          );
          console.log(ordenConsultaMedica)
          console.log(ordenConsultaMedica.id)
          setOrdenConsultaMedicaData({
            id: ordenConsultaMedica[0].id,
            estado_detalle: ordenConsultaMedica[0].estado_detalle,
          });
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleNext = async () => {
    // Lógica para manejar el siguiente paso
  };

  // Mapeamos los datos de `ordenConsultaMedicaData` al formato esperado
  const detalleOrdenData = Object.entries(ordenConsultaMedicaData).map(
    ([key, value]) => ({
      label: key.replace(/_/g, " "), // Reemplazar guiones bajos con espacios para mayor legibilidad
      value: value,
    })
  );

  const sections = [
    {
      title: "Orden",
      data: [
        { label: "ID", value: ordenData.id || "" },
        { label: "Creada", value: ordenData.createdAt || "" },
        { label: "Categoría", value: ordenData.contentType || "" },
        { label: "Estado", value: ordenData.estado || "" },
      ],
    },
    {
      title: "Detalle de Orden",
      data: detalleOrdenData,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
    >
      <Stack.Screen options={{ title: "Caja" }} />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.label}-${index}`}
        renderSectionHeader={({
          section: { title, data, editable, onDataChange },
        }) => (
          <>
            <SectionHeader title={title} />
            {editable ? (
              <EditableTable data={data} onDataChange={onDataChange} />
            ) : (
              <SimpleTable data={data} />
            )}
          </>
        )}
        renderItem={() => null}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={
          <Pressable onPress={handleNext}>
            <BottomButton title="Cerrar" />
          </Pressable>
        }
      />
    </KeyboardAvoidingView>
  );
}