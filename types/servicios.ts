export type Servicio = {
    id: number;
    nombre: string;
    descripcion: string;
    url: string;
    sort_index: number;
    active: boolean;
  };

  export type ConsultaMedica = {
    id: number;
    nombre: string;
    descripcion: string;
    descripcion_larga: string;
    precio: number;
    tiempo_estimado: string;
    cobertura: string;
    sort_index: number;
    active: boolean;
    img_url: string;
  };