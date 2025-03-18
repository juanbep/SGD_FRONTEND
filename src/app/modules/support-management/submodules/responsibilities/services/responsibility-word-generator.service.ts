import { inject, Injectable } from '@angular/core';
import { AlignmentType, Document, Header, ImageRun, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityWordGeneratorService {

  private httpClient = inject(HttpClient);
  
  async generateWordDocument(formData: any, studentInfo: any) {
    const imageData = await this.getImage('assets/images/logo-unicauca-2.png');

    const document = new Document({
      sections: [{
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Formulario de Evaluación del Estudiante',
                    bold: true,
                    size: 28
                  }),
                  new ImageRun({
                    type: "png",
                    data: imageData,
                    transformation: {
                      width: 50,
                      height: 50
                    },
                  })
                ]
              }),
            ]
          })
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Información del Estudiante',
                bold: true,
                size: 28
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Nombres y Apellidos: ${studentInfo.name}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Número de Identificación: ${studentInfo.id}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Departamento: ${studentInfo.department}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Nombre del Director: ${studentInfo.directorName}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Fecha de Evaluación: ${studentInfo.evaluationDate}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Información del Formulario',
                bold: true,
                size: 28
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Título del Trabajo de Grado: ${formData.degreeWorkTitle}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Etapa de Desarrollo: ${formData.developmentStage}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Observaciones: ${formData.observations}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Firma del estudiante: ${formData.studentSignature.name}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Evaluación',
                bold: true,
                size: 28
              })
            ],
          }),
          this.createEvaluationTable(formData, studentInfo.totalAverage),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Observaciones: ${formData.observations}`,
                size: 24
              })
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Firma del estudiante: ${formData.studentSignature.name}`,
                size: 24
              })
            ],
          }),
        ]
      }]
    });

    Packer.toBlob(document).then(blob => {
      saveAs(blob, `Evaluation_${studentInfo.name}.docx`);
    });
  }

  createEvaluationTable(formData: any, totalAverage: number | null): Table {
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Porcentaje de importancia(%)' })],
              width: { size: 15, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Pregunta' })],
              width: { size: 40, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Evaluación' })],
              width: { size: 15, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Equivalente cualitativo' })],
              width: { size: 30, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor ha definido unos horarios regulares de reunión para control y seguimiento del trabajo?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_1 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_1) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor asiste puntualmente a las reuniones programadas?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_2 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_2) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor dedica tiempo suficiente y necesario para discutir asuntos relacionados con el desarrollo del trabajo de grado?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_3 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_3) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor es oportuno en la revisión de los documentos y productos generados?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_4 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_4) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor tiene dominio general sobre la temática relacionada con el proyecto?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_5 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_5) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor sugiere, asesora y realiza aportes para mejorar la calidad del trabajo de grado y/o sus productos?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_6 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_6) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor mantiene una relación cordial de respeto con el estudiante?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_7 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_7) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '12.50%' })] }),
            new TableCell({ children: [new Paragraph({ text: '¿El profesor motiva la investigación, el desarrollo y la innovación en el trabajo de grado?' })] }),
            new TableCell({ children: [new Paragraph({ text: formData.qualification_8 })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(formData.qualification_8) })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '100%' })] }),
            new TableCell({ children: [new Paragraph({ text: 'Total' })] }),
            new TableCell({ children: [new Paragraph({ text: totalAverage?.toString() })] }),
            new TableCell({ children: [new Paragraph({ text: this.qualitativeEquivalent(totalAverage?.toString() || '') })] }),
          ],
        }),
      ],
    });

    return table;
  }

  async getImage(url: string): Promise<ArrayBuffer> {
    const response = await firstValueFrom(this.httpClient.get(url, { responseType: 'arraybuffer' })) as ArrayBuffer;
    return response;
  }

  qualitativeEquivalent(evaluation: string | null){
    if(evaluation === null || evaluation === '') {
      return '';
    }
    const evaluationNumber = Number(evaluation);
    if(evaluationNumber >= 0 && evaluationNumber < 70){
      return 'Deficiente';
    }
    if(evaluationNumber >=70 && evaluationNumber < 80){
      return 'Aceptable';
    }
    if(evaluationNumber >= 80 && evaluationNumber < 90){
      return 'Bueno';
    }
    if(evaluationNumber >= 90 && evaluationNumber <=100){
      return 'Sobresaliente';
    }
    return '';
  }

  dayInWords(day: number): string {
    const days = [
      "", "uno", "dos", "tres", "cuatro", "cinco", "seis",
      "siete", "ocho", "nueve", "diez", "once", "doce",
      "trece", "catorce", "quince", "dieciséis", "diecisiete",
      "dieciocho", "diecinueve", "veinte", "veintiuno",
      "veintidós", "veintitrés", "veinticuatro", "veinticinco",
      "veintiséis", "veintisiete", "veintiocho", "veintinueve",
      "treinta", "treinta y uno"
    ];
  
    return days[day] || "día inválido";
  }

  anioEnPalabra(anio: number): string {
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const especiales = ['once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  
    if (anio < 1000 || anio > 9999) return 'año inválido';
  
    let palabra = '';
  
    const mil = Math.floor(anio / 1000);
    const centena = Math.floor((anio % 1000) / 100);
    const decena = Math.floor((anio % 100) / 10);
    const unidad = anio % 10;
  
    if (mil === 1) palabra += 'mil ';
    else palabra += unidades[mil] + ' mil ';
  
    if (centena > 0) {
      if (centena === 1 && decena === 0 && unidad === 0) palabra += 'cien ';
      else palabra += centenas[centena] + ' ';
    }
  
    if (decena === 1 && unidad > 0) {
      palabra += especiales[unidad - 1];
    } else {
      if (decena > 0) {
        palabra += decenas[decena];
        if (unidad > 0) palabra += ' y ';
      }
      if (unidad > 0) palabra += unidades[unidad];
    }
  
    return palabra.trim();
  }
}
