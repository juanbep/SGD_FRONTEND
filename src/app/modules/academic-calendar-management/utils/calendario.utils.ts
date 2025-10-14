export class Utils {
  static formatearAnioPeriodo(anio: number, periodo: number | null): string {
    if (!periodo) {
      return `${anio}-Sin información`;
    }
    return `${anio}-${periodo}`;
  }

  static getBadgeClass(estado: string): string {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-success';
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      case 'APROBADO':
        return 'bg-info text-dark';
      case 'DESHABILITADO':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }

}
