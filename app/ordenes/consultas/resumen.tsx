import React from 'react';
import { Pressable, SectionList, View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { SectionHeader } from '../../../components/SectionHeader';
import { BottomButton } from '../../../components/Buttons';
import { useOrdenConsultaMedicaContext } from '@/contexts/ordenes';
import { useCarritoContext } from '@/contexts/caja';
import { SimpleTable } from '@/components/Tables';
import { enviarOrden } from '@/api/ubymed';

export default function ResumenScreen() {
    const { ordenConsultaMedicaData } = useOrdenConsultaMedicaContext();
    const { carrito: ordenCarritoData = [] } = useCarritoContext();
    const router = useRouter();

    if (!ordenConsultaMedicaData) {
        return <View><Text>No hay datos disponibles</Text></View>;
    }

    const fecha = new Date(ordenConsultaMedicaData.fecha);
    const formattedDate = fecha.toLocaleDateString();
    const formattedTime = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

    const buildPayload = () => {
        return {
            orden: {
                usuario: 1,
                contenido_tipo: "consulta-medica",
            },
            detalles: {
                socio: 1,
                categoria_consulta: 1,
                estado_detalle: "buscando socio",
                consulta_fecha: ordenConsultaMedicaData.fecha,
                consulta_motivo: ordenConsultaMedicaData.detalles,
                consulta_direccion: ordenConsultaMedicaData.direccion,
                consulta_geolocalizacion: ordenConsultaMedicaData.geolocalizacion,
                paciente_nombre: ordenConsultaMedicaData.paciente_nombre,
                paciente_apellido: ordenConsultaMedicaData.paciente_apellido,
                paciente_edad: "33",
                paciente_dpi: "2220 19494 0101",
                paciente_telefono: ordenConsultaMedicaData.paciente_telefono,
                paciente_email: "test",
                paciente_sexo: "m"
            },
            carrito: (ordenCarritoData || []).map(item => ({
                sku: item.sku,
                cantidad: item.cantidad
            }))
        };
    };

    const handleConfirm = async () => {
        const payload = buildPayload();

        console.log('Payload enviado:', JSON.stringify(payload, null, 2));

        try {
            const response = await enviarOrden(payload);

            // Verificar que la respuesta es un objeto y no undefined
            if (response && typeof response === 'object') {
                console.log('Respuesta completa de la API:', response);

                // Acceder a la propiedad data de la respuesta si existe
                const data = response.data || response;
                console.log('Datos de la respuesta:', data);

                if (data && data.orden && data.orden.id) {
                    const ordenId = data.orden.id;
                    console.log(ordenId)
                    Alert.alert('Éxito', 'Los datos se enviaron correctamente.');
                    const url = `/caja?id=${ordenId}`;
                    console.log('URL construida:', url);
                    router.push(url);
                } else {
                    console.error('La respuesta de la API no contiene el campo esperado');
                    Alert.alert('Error', 'La respuesta de la API no contiene el ID esperado.');
                }
            } else {
                console.error('La respuesta de la API no es un objeto válido');
                Alert.alert('Error', 'La respuesta de la API no es válida.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error.response?.data || error.message);
            Alert.alert('Error', 'Hubo un problema al enviar los datos.');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen options={{ title: "Resumen" }} />
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.label}-${index}`}
                renderSectionHeader={({ section: { title, data } }) => (
                    <>
                        <SectionHeader title={title} />
                        <SimpleTable data={data} />
                    </>
                )}
                renderItem={() => null}
                stickySectionHeadersEnabled={false}
                ListFooterComponent={
                    <Pressable onPress={handleConfirm}>
                        <BottomButton title="Confirmar" />
                    </Pressable>
                }
            />
        </View>
    );
}