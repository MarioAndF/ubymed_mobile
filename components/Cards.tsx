import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from "expo-router";

interface SimpleCardProps {
  text: string;
  onPress?: () => void;  // Añadir onPress como propiedad opcional
}

export const SimpleCard = forwardRef<View, SimpleCardProps>((props, ref) => {
  const { text, onPress } = props;
  return (
    <Pressable ref={ref} style={styles.card} onPress={onPress}>
      <Text style={styles.description}>{text}</Text>
    </Pressable>
  );
});

interface CategoryCardProps {
  nombre: string;
  descripcion: string;
}

export const CategoryCard = forwardRef<View, CategoryCardProps>((props, ref) => {
  const { nombre, descripcion } = props;
  return (
    <View ref={ref} style={styles.card}>
        <Text style={styles.title}>{nombre}</Text>
        <Text style={styles.description}>{descripcion}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
});