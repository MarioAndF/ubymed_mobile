import React, { useState } from 'react';
import { Pressable, SectionList, Alert } from "react-native";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { View } from '@/components/Themed';
import { SectionHeader } from '@/components/SectionHeader';
import { BottomButton } from '@/components/Buttons';
import { SimpleTable, EditableTable } from '@/components/Tables';

export default function CajaScreen() {
    const router = useRouter();

    const detalleItems = [
        { label: 'Consulta Médica', value: "350.00" },
    ];

    // Estado para manejar los datos editables
    const [paymentMethodData, setPaymentMethodData] = useState([
        { label: 'Trajeta de Crédito', value: "" },
        { label: 'CVV', value: "" }
    ]);

    const [invoiceData, setInvoiceData] = useState([
        { label: 'NIT', value: "" }
    ]);

    // Formatear los datos en secciones
    const sections = [
        {
            title: 'Detalles',
            data: [
                {label: "Fecha", value: "15/04/1991 00:00"},
                {label: "Categoría", value: "Consulta Médica"}
            ],
        },
        {
            title: 'Resumen',
            data: [...detalleItems],
        },
        {
            title: 'Método de Pago',
            data: paymentMethodData,
            editable: true,
            onDataChange: setPaymentMethodData,
        },
        {
            title: 'Factura',
            data: invoiceData,
            editable: true,
            onDataChange: setInvoiceData,
        },
    ];

    const handleNext = () => {
        Alert.alert(
            "Compra exitosa",
            "Tu pago ha sido procesado correctamente.",
            [{ text: "OK", onPress: () => router.dismissAll() }]
        );
    };

    return (
        <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}  // Prueba "position" para Android
    keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}   // Ajusta este valor según sea necesario
>
    <Stack.Screen options={{ title: "Caja" }} />
    <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.label}-${index}`}
        renderSectionHeader={({ section: { title, data, editable, onDataChange } }) => (
            <>
                <SectionHeader title={title} />
                {editable ? (
                    <EditableTable data={data} onDataChange={onDataChange} />
                ) : (
                    <SimpleTable data={data} />
                )}
                {title === 'Resumen' && (
                    <SimpleTable data={[{ label: 'TOTAL', value: `450.00` }]} />
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