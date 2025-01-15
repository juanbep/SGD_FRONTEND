

export interface CatalogDataResponse {
    facultades:      Type[];
    departamentos:   Type[];
    categorias:      Type[];
    contrataciones:  Type[];
    dedicaciones:    Type[];
    estudios:        Type[];
    roles:           Type[];
    tipoActividades: Type[];
}

export interface Type {
    nombre: string;
    codigo: string;
}
