import React, { forwardRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
}

export const BottomButton = forwardRef<View, ButtonProps>(({ title }, ref) => {
  return (
    <View ref={ref} style={styles.button}>
        <Text style={styles.title}>{title}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#009af5', // Color celeste
    borderRadius: 16, // Bordes redondeados
    padding: 16, // Padding para el texto
    marginLeft: 24,
    marginRight: 24,
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center', // Centrar el texto   
    justifyContent: 'center' // Centrar el texto verticalmente
  },
  title: {
    color: '#FFFFFF', // Letra color blanco
    fontSize: 14,
    fontWeight: 'bold',
  },
});

