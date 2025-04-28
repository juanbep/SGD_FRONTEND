import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { CatalogDataResponse } from '../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../shared/services/catalogData.service';

@Injectable({
  providedIn: 'root',
})
export class ResponsibilityCoordinatorPdfGeneratorService {
  private httpClient = inject(HttpClient);

  private catalogDataService = inject(CatalogDataService);

  public cataloDataResponse: CatalogDataResponse | null =
    this.catalogDataService.catalogDataSignal;

  async generatePdfDocument(
    formData: any,
    userInfo: any
  ): Promise<{ base64: string; file: File; }> {
    const doc: jsPDF = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    let y = 20;

    // Títulos principales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'EVALUACIÓN COORDINADOR DE TRABAJO DE GRADO',
      pageWidth / 2,
      y,
      { align: 'center' }
    );
    y += 10;
    doc.text(
      'FACULTAD DE INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES',
      pageWidth / 2,
      y,
      { align: 'center' }
    );

    y += 10;

    // Información del coordinador usando campos del formulario y userInfo
    autoTable(doc, {
      startY: y,
      body: [
        [
          'Nombre del evaluado:',
          userInfo.teacherName || '',
          'Num.Id:',
          userInfo.id || '',
        ],
        [
          'Departamento:',
          userInfo.department || '',
          'Nombre del evaluador:',
          userInfo.nameEvaluator || '',
        ],
        [
          'Fecha de evaluación:',
          userInfo.evaluationDate || '',
          'Periodo evaluado:',
          userInfo.period || '',
        ],
        [
          'Nombre de actividad:',
          userInfo.activityName || '',
          '',
          '',
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 1: { fontStyle: 'bold' }, 3: { fontStyle: 'bold' } },
    });

    y =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;

    // Tabla de Evaluación utilizando los campos del formulario
    autoTable(doc, {
      startY: y,
      head: [
        [
          'Componente',
          'Pregunta',
          'Evaluación',
          'Equivalente Cualitativo',
        ],
      ],
      body: [
        // Cumplimiento (30%)
        [
          { content: 'Cumplimiento (30%)', rowSpan: 3 },
          'Asiste a todas las reuniones',
          formData.qualification_1,
          this.getQualitativeEquivalent(Number(formData.qualification_1)),
        ],
        [
          'Llega a la hora acordada y permanece el tiempo de la reunión',
          formData.qualification_2,
          this.getQualitativeEquivalent(Number(formData.qualification_2)),
        ],
        [
          'Realiza las tareas en el plazo previsto',
          formData.qualification_3,
          this.getQualitativeEquivalent(Number(formData.qualification_3)),
        ],
        // Calidad del aporte (30%)
        [
          { content: 'Calidad del aporte (30%)', rowSpan: 4 },
          'Comparte su experiencia con el grupo',
          formData.qualification_4,
          this.getQualitativeEquivalent(Number(formData.qualification_4)),
        ],
        [
          'Es proactivo en la realización de tareas',
          formData.qualification_5,
          this.getQualitativeEquivalent(Number(formData.qualification_5)),
        ],
        [
          'Genera ideas y da pasos importantes en su ejecución',
          formData.qualification_6,
          this.getQualitativeEquivalent(Number(formData.qualification_6)),
        ],
        [
          'Cumple con las tareas encomendadas',
          formData.qualification_7,
          this.getQualitativeEquivalent(Number(formData.qualification_7)),
        ],
        // Calidad de la comunicación (40%)
        [
          { content: 'Calidad de la comunicación (40%)', rowSpan: 3 },
          'Expresa claramente sus ideas',
          formData.qualification_8,
          this.getQualitativeEquivalent(Number(formData.qualification_8)),
        ],
        [
          
          'Maneja el tiempo de sus intervenciones',
          formData.qualification_9,
          this.getQualitativeEquivalent(Number(formData.qualification_9)),
        ],
        [
          'Usa los medios de comunicación adecuadamente (mail, teléfono, etc.)',
          formData.qualification_10,
          this.getQualitativeEquivalent(Number(formData.qualification_10)),
        ],
        // Relaciones personales (30%)
        [
          { content: 'Relaciones personales (30%)', rowSpan: 5 },
          'Respeta las ideas de los demás',
          formData.qualification_11,
          this.getQualitativeEquivalent(Number(formData.qualification_11)),
        ],
        [
          'Acepta sugerencias, observaciones y críticas',
          formData.qualification_12,
          this.getQualitativeEquivalent(Number(formData.qualification_12)),
        ],
        [
          'Demuestra pertinencia por el grupo',
          formData.qualification_13,
          this.getQualitativeEquivalent(Number(formData.qualification_13)),
        ],
        [
          'Refleja su espíritu de colaboración',
          formData.qualification_14,
          this.getQualitativeEquivalent(Number(formData.qualification_14)),
        ],
        [
          'Inspira confianza al grupo',
          formData.qualification_15,
          this.getQualitativeEquivalent(Number(formData.qualification_15)),
        ],
        // Total
        [
          { content: '100%' },
          'Promedio Total',
          userInfo.totalAverage,
          this.getQualitativeEquivalent(Number(userInfo.totalAverage)),
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
      },
      bodyStyles: { fontSize: 10 },
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

    // Firma: se usa la firma (o el nombre del coordinador si no hay archivo)
    doc.setFontSize(12);
    doc.text('Firma:', 10, y);
    if (formData.userSignature) {
      doc.addImage((await this.convertFileToBase64(formData.userSignature)), 'PNG', 30, y - 10, 30, 30);
      y += 50;
    } else {
      doc.line(10, y + 10, 80, y + 10);
      const signatureText =
        userInfo.coordinatorName || '';
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

    // Función auxiliar para convertir una imagen de un dato tipo file a base64
  
    convertFileToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
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