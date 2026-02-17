// Response types
export interface ConfiguracionResponse {
  oidConfigGeneral: number;
  clave: string;
  valor: string;
  habilitado: boolean;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface ConfiguracionesListResponse {
  codigo: number;
  mensaje: string;
  data: {
    content: ConfiguracionResponse[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

export interface GetConfiguracionResponse {
  codigo: number;
  mensaje: string;
  data: ConfiguracionResponse;
}

export interface GetConfiguracionValorResponse {
  codigo: number;
  mensaje: string;
  data: string; // Solo el valor
}

export interface CreateConfiguracionResponse {
  codigo: number;
  mensaje: string;
  data: ConfiguracionResponse;
}

export interface UpdateConfiguracionResponse {
  codigo: number;
  mensaje: string;
  data: ConfiguracionResponse;
}

export interface DeleteConfiguracionResponse {
  codigo: number;
  mensaje: string;
  data: null;
}

// DTOs
export interface CreateConfiguracionDTO {
  clave: string;
  valor: string;
  habilitado: boolean;
}

export interface UpdateConfiguracionDTO {
  oidConfigGeneral: number;
  clave: string;
  valor: string;
  habilitado: boolean;
}

export interface DeleteConfiguracionDTO {
  oidConfigGeneral: number;
}

// Filters
export interface ConfiguracionFilters {
  page?: number;
  size?: number;
  sort?: string;
  clave?: string;
  habilitado?: boolean;
}
