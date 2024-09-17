// REACT / REACT NATIVE
import React from 'react';
import { StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Stack, useRouter } from 'expo-router';
// UI COMPONENTS
import { Text, View } from '@/components/Themed';
import { HeaderText } from '@/components/StyledText';
import { TextView } from '@/components/TextFields';
import { BottomButton } from '@/components/Buttons';
// CONTEXTS
import { useOrdenConsultaMedicaContext } from '@/contexts/ordenes';

export default function MotivoScreen() {
    const router = useRouter();
    const { ordenConsultaMedicaData, updateOrdenConsultaMedicaData } = useOrdenConsultaMedicaContext();
    const [detalles, setDetalles] = React.useState('');

    // Inicializa el estado local con el valor del contexto cuando el componente se monta
    React.useEffect(() => {
        if (ordenConsultaMedicaData.detalles) {
            setDetalles(ordenConsultaMedicaData.detalles);
        }
    }, [ordenConsultaMedicaData.detalles]);

    // Actualiza el estado local cuando el campo de texto cambia
    const handleDetallesChange = (text: string) => {
        setDetalles(text);
    };

    const handleNext = () => {
        // Actualiza el contexto solo cuando el usuario presiona "Siguiente"
        updateOrdenConsultaMedicaData({ detalles });
        router.push('/ordenes/consultas-medicas/crear/lugar');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Stack.Screen options={{ title: "Motivo" }} />
                <HeaderText>¿Cuál es el motivo de la consulta?</HeaderText>
                <TextView
                    placeholder="Escribe aquí"
                    value={detalles}
                    onChangeText={handleDetallesChange}
                />
                <Pressable onPress={handleNext}>
                    <BottomButton title="Siguiente" />
                </Pressable>
            </View>
        </TouchableWithoutFeedback>
    );
}