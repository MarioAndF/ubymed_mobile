import React, { useState, useEffect } from "react";
import { Pressable, SectionList, Alert } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SectionHeader } from "@/components/SectionHeader";
import { BottomButton } from "@/components/Buttons";
import { SimpleTable, EditableTable } from "@/components/Tables";
import { obtenerUbymedAPI, enviarOrden } from "@/api/ubymed"; // Asegúrate de que la ruta sea correcta
import { useCarritoContext } from "@/contexts/caja"; // Asegúrate de ajustar la ruta de importación
import { format } from 'date-fns'

export default function CajaScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  const router = useRouter();
  const { vaciarCarrito } = useCarritoContext(); // Desestructurar la función vaciarCarrito del contexto

  const [ordenData, setOrdenData] = useState({});
  const [detalleItems, setDetalleItems] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([
    { label: "Tarjeta de Crédito", value: "" },
    { label: "CVV", value: "" },
  ]);
  const [invoiceData, setInvoiceData] = useState({}); // Datos de factura
  const [nitData, setNitData] = useState([{ label: "NIT", value: "" }]);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Obtener los detalles de la orden
          const orden = await obtenerUbymedAPI(`ordenes/${id}`);
          const formattedDate = format(new Date(orden.created_at), 'dd/MM/yyyy HH:mm')
          setOrdenData({
            id: id,
            createdAt: formattedDate,
            contentType: orden.contenido_tipo,
            estado: orden.estado,
          });

          // Obtener los ítems del carrito
          const carritoResponse = await obtenerUbymedAPI(
            `caja/carrito-items?orden=${id}`
          );
          const itemsWithDetails = await Promise.all(
            carritoResponse.map(async (item) => {
              const itemDetails = await obtenerUbymedAPI(
                `catalogo/item/${item.item}`
              );
              return {
                label: `${itemDetails.nombre} (${item.cantidad})`, // Agrega la cantidad en paréntesis
                value: Number(itemDetails.precio).toFixed(2), // Asegúrate de que el precio sea un número
              };
            })
          );
          setDetalleItems(itemsWithDetails);

          // Obtener la factura
          const facturaResponse = await obtenerUbymedAPI(
            `caja/facturas?orden=${id}`
          );
          console.log("Respuesta de la factura:", facturaResponse); // Verifica la respuesta de la API
          if (facturaResponse) {
            const total = parseFloat(facturaResponse.total);
            if (isNaN(total)) {
              console.error(
                "El total de la factura no es un número válido:",
                facturaResponse.total
              );
              throw new Error("El total de la factura no es un número válido");
            }
            setInvoiceData({
              label: "Total",
              value: total.toFixed(2),
            });
          } else {
            console.error("No se recibieron datos de la factura.");
            throw new Error("No se recibieron datos de la factura.");
          }
        } catch (error) {
          console.error("Error al obtener datos:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleNext = async () => {
    vaciarCarrito();
    Alert.alert("Compra exitosa", "Tu pago ha sido procesado correctamente.", [
      { text: "OK", onPress: () => router.dismissAll() },
    ]);
  };

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
      title: "Detalle de Cuenta",
      data: detalleItems,
    },
    {
      title: "Método de Pago",
      data: paymentMethodData,
      editable: true,
      onDataChange: setPaymentMethodData,
    },
    {
      title: "Datos de Factura",
      data: nitData,
      editable: true,
      onDataChange: setNitData,
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
            {title === "Detalle de Cuenta" && (
              <SimpleTable
                data={[{ label: "TOTAL", value: invoiceData.value || "0.00" }]}
              />
            )}
          </>
        )}
        renderItem={() => null}
        stickySectionHeadersEnabled={false}
        ListFooterComponent={
          <Pressable onPress={handleNext}>
            <BottomButton title="Confirmar Pago" />
          </Pressable>
        }
      />
    </KeyboardAvoidingView>
  );
}
