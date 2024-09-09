import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { HeaderText } from '../../../components/StyledText';
import { SingleSelectTable, DateTimeTable } from '../../../components/Tables'; 
import { BottomButton } from '../../../components/Buttons';
import { useOrdenConsultaMedicaContext } from '@/contexts/ordenes';
import { OrdenConsultaMedica } from '@/types/ordenes';

export default function FechaScreen() {
    const router = useRouter(); 
    const { updateOrdenConsultaMedicaData } = useOrdenConsultaMedicaContext();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const options = [
        { id: '0', name: 'Lo antes posible' },
        { id: '1', name: 'Elegir fecha y hora' },
    ];

    const handleOptionSelect = (id: string) => {
        setSelectedOption(id);
        if (id === '0') {
            setSelectedDate(new Date());
        }
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleNext = () => {
        const updatedData: Partial<OrdenConsultaMedica> = {};

        if (selectedOption === '0') {
            updatedData.fecha = new Date().toISOString();
        } else if (selectedOption === '1') {
            if (selectedDate) {
                updatedData.fecha = selectedDate.toISOString(); 
            } else {
                Alert.alert('Error', 'Por favor, ingrese una fecha y hora válidas.');
                return;
            }
        } else {
            Alert.alert('Error', 'Por favor, seleccione una opción.');
            return;
        }

        updateOrdenConsultaMedicaData(updatedData);
        router.push('/ordenes/consultas/cliente');
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Fecha" }} />
            <HeaderText>¿Cuándo necesitas la consulta?</HeaderText>
            <SingleSelectTable data={options} onRowSelect={handleOptionSelect} />
            {selectedOption === '1' && (
                <DateTimeTable
                    initialDate={selectedDate}
                    onDateChange={handleDateChange}  // Asegúrate de que el componente DateTimeTable use esta función
                />
            )}
            <Pressable onPress={handleNext}>
                <BottomButton title="Siguiente" />
            </Pressable>
        </View>
    );
}