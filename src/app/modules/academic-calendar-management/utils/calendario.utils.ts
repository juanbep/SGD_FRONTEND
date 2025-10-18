import { Fecha } from '../models';

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

  static ordenarFechasPorOid(fechas: Fecha[]): Fecha[] {
    if (!fechas || fechas.length === 0) return [];

    return [...fechas].sort((a, b) => a.oidNombreFecha - b.oidNombreFecha);
  }

  /**
   * Formatea una fecha según si es única o rango
   * @param fechaInicial Fecha inicial
   * @param fechaFin Fecha final (opcional)
   * @param oidNombreFecha ID del tipo de fecha
   * @returns String formateado según el tipo de fecha
   */
  static formatearFecha(
    fechaInicial: Date | string | null,
    fechaFin: Date | string | null,
    oidNombreFecha: number
  ): string {
    if (!fechaInicial) return '-';

    const fechaInicio = new Date(fechaInicial);

    // Id de nombres de fechas unicas
    const oidsFechaUnica = [1, 6, 7, 8, 10, 12, 14, 15, 16, 18, 19];

    // Array de nombres de meses en español
    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    // ✅ OIDs que requieren el prefijo "Hasta el"
    const OIDS_CON_PREFIJO_HASTA = [4, 5, 8, 12, 14];

    // Formato para fecha única: "7 de julio de 2025"
    const formatearFechaCompleta = (date: Date): string => {
      const dia = date.getDate();
      const mes = meses[date.getMonth()];
      const anio = date.getFullYear();
      return `${dia} de ${mes} de ${anio}`;
    };

    // ✅ Formato para fecha única con prefijo "Hasta el"
    const formatearFechaHasta = (date: Date): string => {
      const dia = date.getDate();
      const mes = meses[date.getMonth()];
      const anio = date.getFullYear();
      return `Hasta el ${dia} de ${mes} de ${anio}`;
    };

    // Formato para rango
    const formatearRango = (inicio: Date, fin: Date): string => {
      const diaInicio = inicio.getDate();
      const mesInicio = meses[inicio.getMonth()];
      const anioInicio = inicio.getFullYear();

      const diaFin = fin.getDate();
      const mesFin = meses[fin.getMonth()];
      const anioFin = fin.getFullYear();

      // Si es el mismo mes y año
      if (mesInicio === mesFin && anioInicio === anioFin) {
        return `Del ${diaInicio} al ${diaFin} de ${mesInicio} de ${anioInicio}`;
      }

      // Si es el mismo año pero diferente mes
      if (anioInicio === anioFin) {
        return `Del ${diaInicio} de ${mesInicio} al ${diaFin} de ${mesFin} de ${anioFin}`;
      }

      // Si son años diferentes
      return `Del ${diaInicio} de ${mesInicio} de ${anioInicio} al ${diaFin} de ${mesFin} de ${anioFin}`;
    };

    // Verificar si es fecha única según su oidNombreFecha
    const esFechaUnica = oidsFechaUnica.includes(oidNombreFecha);

    if (esFechaUnica) {
      // ✅ Verificar si requiere el prefijo "Hasta el"
      if (OIDS_CON_PREFIJO_HASTA.includes(oidNombreFecha)) {
        return formatearFechaHasta(fechaInicio);
      }

      // Fecha única normal: "7 de julio de 2025"
      return formatearFechaCompleta(fechaInicio);
    }

    // Fecha con rango
    if (fechaFin) {
      const fechaFinDate = new Date(fechaFin);
      return formatearRango(fechaInicio, fechaFinDate);
    }

    // Si no hay fechaFin pero debería ser rango, mostrar solo inicio
    return formatearFechaCompleta(fechaInicio);
  }
}
