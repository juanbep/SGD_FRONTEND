export class Utils {
  static formatearAnioPeriodo(anio: number, periodo: number | null): string {
    if (!periodo) {
      return `${anio}-Sin información`;
    }
    return `${anio}-${periodo}`;
  }
}
