export interface SimpleResponse<T> {
    codigo: number;
    mensaje: string;
    data: T;
}