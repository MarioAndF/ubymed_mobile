// CarritoContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Carrito, CarritoItem } from './types';

type CarritoContextType = {
  carrito: Carrito;
  agregarItem: (item: CarritoItem) => void;
  eliminarItem: (sku: string) => void;
  actualizarCantidad: (sku: string, cantidad: number) => void;
  vaciarCarrito: () => void; // Función para vaciar el carrito
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const useCarritoContext = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarritoContext debe usarse dentro de un CarritoProvider');
  }
  return context;
};

export const CarritoProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [carrito, setCarrito] = useState<Carrito>([]);

  // Función para agregar un item al carrito
  const agregarItem = (item: CarritoItem) => {
    setCarrito(prevCarrito => {
      const index = prevCarrito.findIndex(i => i.sku === item.sku);
      if (index >= 0) {
        // Si el item ya existe, actualizar la cantidad
        const newCarrito = [...prevCarrito];
        newCarrito[index].cantidad += item.cantidad;
        console.log('Carrito después de agregar item:', newCarrito); // Imprimir el carrito en consola
        return newCarrito;
      }
      // Si el item no existe, agregarlo
      const updatedCarrito = [...prevCarrito, item];
      console.log('Carrito después de agregar item:', updatedCarrito); // Imprimir el carrito en consola
      return updatedCarrito;
    });
  };

  // Función para eliminar un item del carrito
  const eliminarItem = (sku: string) => {
    setCarrito(prevCarrito => {
      const updatedCarrito = prevCarrito.filter(item => item.sku !== sku);
      console.log('Carrito después de eliminar item:', updatedCarrito); // Imprimir el carrito en consola
      return updatedCarrito;
    });
  };

  // Función para actualizar la cantidad de un item
  const actualizarCantidad = (sku: string, cantidad: number) => {
    setCarrito(prevCarrito => {
      const index = prevCarrito.findIndex(item => item.sku === sku);
      if (index >= 0) {
        const newCarrito = [...prevCarrito];
        if (cantidad <= 0) {
          // Eliminar el item si la cantidad es 0 o menor
          newCarrito.splice(index, 1);
        } else {
          // Actualizar la cantidad del item
          newCarrito[index].cantidad = cantidad;
        }
        console.log('Carrito después de actualizar cantidad:', newCarrito); // Imprimir el carrito en consola
        return newCarrito;
      }
      return prevCarrito;
    });
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    console.log('Carrito ha sido vaciado'); // Imprimir en consola cuando el carrito se vacíe
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarItem, eliminarItem, actualizarCantidad, vaciarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
};