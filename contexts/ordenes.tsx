import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrdenConsultaMedica } from '@/types/ordenes'; // Importa tu tipo aquí

type OrdenConsultaMedicaContextType = {
  ordenConsultaMedicaData: OrdenConsultaMedica;
  updateOrdenConsultaMedicaData: (data: Partial<OrdenConsultaMedica>) => void;
};

const OrdenContext = createContext<OrdenConsultaMedicaContextType | undefined>(undefined);

export const useOrdenConsultaMedicaContext = () => {
  const context = useContext(OrdenContext);
  if (!context) {
    throw new Error('useOrden debe usarse dentro de un OrdenProvider');
  }
  return context;
};

export const OrdenConsultaMedicaProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [ordenConsultaMedicaData, setOrdenConsultaMedicaData] = useState<OrdenConsultaMedica>({
    paciente_nombre: '',
    paciente_apellido: '',
    paciente_telefono: '',
    detalles: '',
    geolocalizacion: '',
    direccion: '',
  });

  // Función para actualizar el estado parcialmente
  const updateOrdenConsultaMedicaData = (data: Partial<OrdenConsultaMedica>) => {
    setOrdenConsultaMedicaData(prevData => ({ ...prevData, ...data }));
    console.log(ordenConsultaMedicaData)
  };

  return (
    <OrdenContext.Provider value={{ ordenConsultaMedicaData, updateOrdenConsultaMedicaData }}>
      {children}
    </OrdenContext.Provider>
  );
};