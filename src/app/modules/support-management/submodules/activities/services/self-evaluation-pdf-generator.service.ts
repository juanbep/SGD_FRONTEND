import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class SelfEvaluationPdfGeneratorService {
  private httpClient = inject(HttpClient);

  generatePdfDocument(formData: any, teacherInfo: any): { base64: string; file: File } {
    const doc: jsPDF = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Formulario de Autoevaluación', pageWidth / 2, 20, { align: 'center' });

    // Información docente y actividad
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: 30,
      body: [
        ['Nombre del docente:', teacherInfo?.nombres + ' ' + teacherInfo?.apellidos || ''],
        ['Identificación:', teacherInfo?.identificacion || ''],
        ['Descripción actividad:', formData.activityDescription || ''],
      ],
      theme: 'grid',
      styles: { fontSize: 11 },
    });

    let y = (doc as any).lastAutoTable.finalY + 10;

    // Tabla de resultados (si existen)
    if (formData.results && formData.results.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Resultado', 'ODS']],
        body: formData.results.map((r: any) => [r.result || '', r.ODS || '']),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
          },
      });
      y = (doc as any).lastAutoTable.finalY + 10;
    }

    // Lecciones aprendidas
    if (formData.lessonsLearned && formData.lessonsLearned.length > 0) {
      doc.text('Lecciones aprendidas:', 10, y);
      y += 5;
      formData.lessonsLearned.forEach((lesson: any, index: number) => {
        doc.text(`${index + 1}. ${lesson.lesson || ''}`, 10, y);
        y += 7;
      });
      y += 5;
    }

    // Oportunidades de mejora
    if (formData.improvementOpportunities && formData.improvementOpportunities.length > 0) {
      doc.text('Oportunidades de mejora:', 10, y);
      y += 5;
      formData.improvementOpportunities.forEach((opp: any, index: number) => {
        doc.text(`${index + 1}. ${opp.opportunity || ''}`, 10, y);
        y += 7;
      });
    }

    y += 10;
    // Evaluación y observaciones
    doc.text(`Evaluación: ${formData.evaluation || ''}`, 10, y);
    y += 7;
    doc.text(`Observaciones: ${formData.observation || ''}`, 10, y);
    y += 10;
    // NUEVO: Campo firma
    doc.setFont('helvetica', 'bold');
    doc.text('Firma:', 10, y);
    doc.setFont('helvetica', 'normal');
    if (formData.signature) {
      try {
        // Se agrega la imagen de la firma (se asume formato PNG)
        doc.addImage(formData.signature, 'PNG', 30, y - 10, 30, 30);
        y += 40;
      } catch (e) {
        // Si falla, se dibuja una línea para firmar
        doc.line(30, y, 80, y);
        y += 10;
      }
    } else {
      doc.line(30, y, 80, y);
      y += 10;
    }

    // Conversión a base64 y blob
    const base64 = doc.output('datauristring');
    const blob = doc.output('blob');
    const file = new File([blob], 'self_evaluation.pdf', { type: 'application/pdf' });
    return { base64, file };
  }
}
