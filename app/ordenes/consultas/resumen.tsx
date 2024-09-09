import React from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { SectionHeader } from '../../../components/SectionHeader';
import { BottomButton } from '../../../components/Buttons';
import { useOrdenConsultaMedicaContext } from '@/contexts/ordenes';
import { SimpleTable } from '@/components/Tables';

export default function ResumenScreen() {
    const { ordenConsultaMedicaData } = useOrdenConsultaMedicaContext();
    const router = useRouter();

    // Extract date and time from fecha
    const fecha = new Date(ordenConsultaMedicaData.fecha);
    const formattedDate = fecha.toLocaleDateString(); // Extracts the date portion
    const formattedTime = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extracts the time portion

    // Formatear los datos en secciones
    const sections = [
        {
            title: 'Fecha',
            data: [
                { label: 'Fecha', value: formattedDate },
                { label: 'Hora', value: formattedTime }
            ]
        },
        {
            title: 'Paciente',
            data: [
                { label: 'Nombre', value: ordenConsultaMedicaData.paciente_nombre },
                { label: 'Apellido', value: ordenConsultaMedicaData.paciente_apellido },
                { label: 'Teléfono', value: ordenConsultaMedicaData.paciente_telefono },
            ]
        },
        {
            title: 'Motivo',
            data: [
                { label: 'Detalles', value: ordenConsultaMedicaData.detalles },
            ]
        },
        {
            title: 'Lugar',
            data: [
                { label: 'Ubicación', value: ordenConsultaMedicaData.geolocalizacion },
                { label: 'Dirección', value: ordenConsultaMedicaData.direccion },
            ]
        },
    ];

    const handleNext = () => {
        router.push('/caja');
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Caja" }} />
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.label}-${index}`}
                renderSectionHeader={({ section: { title, data } }) => (
                    <>
                        <SectionHeader title={title} />
                        <SimpleTable data={data} />
                    </>
                )}
                renderItem={() => null}  // Esto previene el error proporcionando un renderItem vacío
                ListFooterComponent={
                    <Pressable onPress={handleNext}>
                        <BottomButton title="Confirmar" />
                    </Pressable>
                }
            />
        </View>
    );
}