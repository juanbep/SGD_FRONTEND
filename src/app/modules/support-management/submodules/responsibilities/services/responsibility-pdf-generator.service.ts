import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CatalogDataResponse } from '../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../shared/services/catalogData.service';

@Injectable({
  providedIn: 'root',
})
export class ResponsibilityPdfGeneratorService {
  private httpClient = inject(HttpClient);

  private catalogDataService = inject(CatalogDataService);

  public cataloDataResponse: CatalogDataResponse | null =
    this.catalogDataService.catalogDataSignal;

  generatePdfDocument(
    formData: any,
    studentInfo: any
  ): { base64: string; file: File } {
    const logoBase64 = this.getBase64ImageFromURL(
      'assets/images/logo-unicauca-2.png'
    );

    const doc: jsPDF = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    let y = 100;

    doc.setFontSize(12);
    doc.text(' ', 100, y);
    y += 100;

    // Títulos principales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'EVALUACIÓN DIRECTOR DE TRABAJO DE GRADO POR PARTE DE LOS ESTUDIANTES',
      pageWidth / 2,
      20,
      { align: 'center' }
    );
    doc.text(
      'FACULTAD DE INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES',
      pageWidth / 2,
      27,
      { align: 'center' }
    );

    y = 35;

    // Información del estudiante y director usando campos del formulario y studentInfo
    autoTable(doc, {
      startY: y,
      body: [
        [
          'Fecha de Evaluación:',
          studentInfo.evaluationDate || '',
          'Etapa de desarrollo',
          this.developmentStageName(formData.developmentStage) || '',
        ],
        [
          'Nombre del director:',
          studentInfo.directorName || '',
          'Departamento:',
          studentInfo.department || '',
        ],
        [
          'Nombre del estudiante:',
          studentInfo.name || '',
          'Código:',
          studentInfo.id || '',
        ],
        ['Título del trabajo de grado:', formData.degreeWorkTitle || '', ''],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 1: { fontStyle: 'bold' }, 3: { fontStyle: 'bold' } },
    });

    y =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;
    // Tabla de Evaluación utilizando los campos del formulario
    const questions = [
      'El profesor ha definido horarios regulares de reunión',
      'El profesor asiste puntualmente a las reuniones',
      'El profesor dedica tiempo suficiente para discutir avances',
      'El profesor revisa los documentos a tiempo',
      'El profesor tiene dominio sobre la temática',
      'El profesor asesora y mejora la calidad del trabajo',
      'El profesor mantiene una relación cordial',
      'El profesor motiva la investigación e innovación',
    ];
    autoTable(doc, {
      startY: y,
      head: [
        [
          'Importancia (%)',
          'Pregunta',
          'Evaluación',
          'Equivalente Cualitativo',
        ],
      ],
      body: questions
        .map((question, index) => {
          const evalValue = formData[`qualification_${index + 1}`];
          const numericEval = Number(evalValue);
          return [
            '12.50%',
            question,
            evalValue,
            this.getQualitativeEquivalent(numericEval),
          ];
        })
        .concat([
          [
            '100%',
            'Total',
            studentInfo.totalAverage,
            this.getQualitativeEquivalent(Number(studentInfo.totalAverage)),
          ],
        ]),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 10 },
      didParseCell: (data) => {
        if (
          data.section === 'body' &&
          data.column.index === 3 &&
          this.getQualitativeEquivalent(Number(data.cell.raw)) ===
            'Sobresaliente'
        ) {
          data.cell.styles.fillColor = [144, 238, 144]; // Fondo verde para "Sobresaliente"
        }
      },
    });

    y =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;

    // Observaciones usando el campo del formulario
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', 10, y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: y + 5,
      body: [[formData.observations || 'Ninguna']],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 6 },
    });
    y =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;

    // Firma: se usa la firma (o el nombre del estudiante si no hay archivo)
    doc.setFontSize(12);
    doc.text('Firma:', 10, y);
    if (formData.studentSignature) {
      doc.addImage(formData.studentSignature, 'PNG', 30, y - 10, 30, 30);
      y += 50;
    } else {
      doc.line(10, y + 10, 80, y + 10);
      const signatureText = studentInfo.name || 'VIDAL SÁNCHEZ ANDRÉS FELIPE';
      doc.text(signatureText, 10, y + 20);
      y += 30;
    }

    // Convertir a base64 y blob
    const base64 = doc.output('datauristring');
    const blob = doc.output('blob');
    const file = new File([blob], 'document.pdf', { type: 'application/pdf' });
    return { base64, file };
  }

  // Función auxiliar para obtener el equivalente cualitativo según la calificación
  private getQualitativeEquivalent(evaluation: number): string {
    if (isNaN(evaluation)) return '';
    if (evaluation < 70) return 'Deficiente';
    if (evaluation < 80) return 'Aceptable';
    if (evaluation < 90) return 'Bueno';
    return 'Sobresaliente';
  }

  async getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(url, { responseType: 'blob' }).subscribe((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

  private developmentStageName(developmentStage: string): string {
    const nameDevelopmentStage =
      this.cataloDataResponse?.estadoEtapaDesarrollo.find(
        (element) => element.oidEstadoEtapaDesarrollo.toString() === developmentStage
      )?.nombre;

    return nameDevelopmentStage || '';
  }
}
