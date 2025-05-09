import { inject, Injectable } from '@angular/core';
import { AlignmentType, Document, Header, ImageRun, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UsuarioResponse } from '../../../../../core/models/response/usuario-response.model';
import { PeriodoAcademicoResponse } from '../../../../../core/models/response/periodo-academico-response.model';
import { DetalleUsuarioConsolidadoResponse } from '../../../../../core/models/response/detalle-usuario-cosolidado-response.model';
import { UsuarioConsolidadoCreadoResponse } from '../../../../../core/models/response/usuarios-consolidado-creado-response.model';


@Injectable({
    providedIn: 'root'
})
export class CpdWordGeneratorService {

    private httpClient = inject(HttpClient);

    public currentDateDay: string | null = null;
    public currentDateMonth: string | null = null;
    public currentDateYear: string | null = null;
    public startPeriodDate: string | null = null;
    public endPeriodDate: string | null = null;
    public oficioDate: string | null = null;
    public meetingCouncil: string | null = null;
    public currenAcademicPeriod: PeriodoAcademicoResponse | null = null;
    public usuarioResponse: UsuarioResponse | null = null;

    async generateWordDocument(teacherConsolidated: UsuarioResponse,  averageEvaluation:number, infoConsolidated:{resolutionNumber: string, resolutionDate:string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string}) {

        const imageData = await this.getImage('assets/images/logo-unicauca-2.png');

        this.currentDateDay = new Date().toLocaleDateString('es-ES', { day: 'numeric' });
        this.currentDateMonth = new Date().toLocaleDateString('es-ES', { month: 'long' });
        this.currentDateYear = new Date().toLocaleDateString( 'es-ES', { year: 'numeric' });
        this.oficioDate = this.changeDateFormat(new Date(infoConsolidated.oficioDate));
        this.meetingCouncil = this.changeDateFormat(new Date(infoConsolidated.meetingCouncil));

        this.usuarioResponse = teacherConsolidated;
        

        const document = new Document({
            sections: [{
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'Facultad de Ingeniería Electrónica y Telecomunicaciones',
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
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'Consejo de Facultad',
                                        bold: true,
                                        size: 28
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
                                text: infoConsolidated.resolutionNumber,
                                bold: true,
                                size: 28
                            })
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: `${this.currentDateDay} de ${this.currentDateMonth}`,
                                bold: true,
                                size: 28
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 300, before: 300 },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Por lo cual se evalúa el desempeño de un docente',
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'EL CONSEJO DE FACULTAD DE INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES DE LA UNIVERSIDAD DEL CAUCA, en uso de sus atribuciones estatutarias y en especial la conferida en el Artículo 12 del Acuerdo Superior N° 090 de 2005 y,',
                                size: 24
                            }),

                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 250, after: 250 },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'CONSIDERANDO',
                                bold: true,
                                size: 26
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'El Acuerdo Superior N° 090 de 2005 por el cual se adopta el sistema de evaluación del profesor define en el artículo 2 que la evaluación profesoral es ',
                                size: 24
                            }),
                            new TextRun({
                                text: '"es un proceso permanente, periódico, integral y público que permite establecer el grado de cumplimiento de las actividades asignadas y la calidad de las mismas, con el fin de propiciar el mejoramiento continuo de la labor docente".',
                                size: 24,
                                italics: true
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'El objetivo de la evaluación profesoral es calificar y cualificar la labor docente desempeñada por el profesor, permitir el ingreso y promoción del personal docente en el escalafón universitario, posibilitar el acceso al otorgamiento de los estímulos contemplados en la ley y los estatutos de la Universidad, entre otros.',
                                size: 24
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'El artículo 5 del Acuerdo Superior N° 090 de 2005 señala: ',
                                size: 24
                            }),
                            new TextRun({
                                text: '"La evaluación se adelantará integralmente sobre todas las actividades desempeñadas por el profesor, en concordancia con las modalidades previstas en el Estatuto Profesoral, con base en la labor oficialmente aprobada por las instancias universitarias pertinentes y considera aspectos esenciales de su función como docente y como integrante de la comunidad académica institucional". ',
                                italics: true,
                                size: 24
                            }),
                            new TextRun({
                                text: 'La evaluación se hará con base en la información recolectada a través de diversos instrumentos y técnicas en consonancia con las actividades asignadas como: Formato de asignación de labor docente, Informe de actividades del profesor, Informes de gestión, Encuestas, Entrevistas, Talleres, Actas de reunión, Informes de superiores, entre otros que la Institución estime pertinente.',
                                size: 24
                            }),
                        ],

                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'El artículo 7 del sistema de evaluación establece que: ',
                                size: 24
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: '"La calificación se hará de manera cualitativa y cuantitativa. Para los efectos cuantitativos, la calificación se expresará en puntos en la escala de 0 a 100. Para efectos cualitativos la calificación se expresará con los términos: excelente, bueno, aceptable y deficiente.',
                                size: 24,
                                italics: true
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'La correspondencia entre dos formas de calificación será la siguiente:',
                                size: 24

                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        text: 'Excelente 91 a 100',
                        bullet: {
                            level: 0,
                        }
                    }),
                    new Paragraph({
                        text: 'Bueno 81 a 90',
                        bullet: {
                            level: 0,
                        }
                    }),
                    new Paragraph({
                        text: 'Aceptable 70 a 80',
                        bullet: {
                            level: 0,
                        }
                    }),
                    new Paragraph({
                        text: 'Deficiente menos de 70',
                        bullet: {
                            level: 0,
                        }
                    }),

                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `El Comité de Personal Docente de la Facultad de Ingeniería Electrónica y Telecomunicaciones, después de realizar el proceso de consulta y procesamiento de la información obtenida de las distintas fuentes de evaluación docente, mediante oficio No. ${infoConsolidated.oficioNumber} del ${this.oficioDate}, presentó ante el Consejo de Facultad la propuesta de calificación de cada uno de los profesores de planta adscritos a esta unidad académica, para el período comprendido entre el ${this.startPeriodDate} y el ${this.endPeriodDate}.`,
                                size: 24
                            }),
                        ],
                    }),


                ]
            },
            {
                children: [
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `El Consejo de Facultad reunido en sesión ordinaria el día ${this.meetingCouncil} decidió aprobar la propuesta de calificación presentada por el Comité de Personal Docente de la Facultad de Ingeniería Electrónica y Telecomunicaciones, para cada uno de los profesores de planta adscritos a esta unidad académica, y expedir el respectivo acto administrativo de evaluación de experiencia docente calificada.`,
                                size: 26
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `El profesor(a) ${teacherConsolidated.nombres} ${teacherConsolidated.apellidos}, identificado(a) con la cédula de ciudadanía No. ${teacherConsolidated.identificacion}, profesor(a) de tiempo completo adscrito(a) al ${teacherConsolidated.usuarioDetalle.departamento}, ha cumplido un año académico más de experiencia en la Universidad del Cauca y de conformidad con la reglamentación vigente, al completar un año de experiencia, el desempeño del docente debe ser evaluado y calificado.`,
                                size: 24
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `El(la) profesor(a) ${teacherConsolidated.nombres} ${teacherConsolidated.apellidos}, obtuvo una evaluación ${this.getDescritionQualification(averageEvaluation)}, la cual fue calificada con ${averageEvaluation.toFixed(2)} puntos.`,
                                size: 24
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'RESUELVE',
                                bold: true,
                                size: 26
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'ARTÍCULO PRIMERO: ',
                                size: 24,
                                bold: true
                            },
                            ),
                            new TextRun({
                                text: `Evaluar el desempeño del (la) profesor(a) ${teacherConsolidated.nombres} ${teacherConsolidated.apellidos} de ${teacherConsolidated.usuarioDetalle.dedicacion} en la categoría de ${teacherConsolidated.usuarioDetalle.categoria}, adscrito al ${teacherConsolidated.usuarioDetalle.departamento}, con una calificación cuantitativa de ${averageEvaluation.toFixed(2)} puntos equivalentes a una calificación cualitativa ${this.getDescritionQualification(averageEvaluation)}, para los periodos académicos correspondientes al ${infoConsolidated.resolutionDate}.`,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'ARTÍCULO SEGUNDO: ',
                                size: 24,
                                bold: true
                            },
                            ),
                            new TextRun({
                                text: `Notificar personalmente o por aviso mediante correo electrónico al profesor(a) ${teacherConsolidated.nombres} ${teacherConsolidated.apellidos} del contenido de la presente resolución, advirtiéndole que contra el presente Acto Administrativo procede el recurso de reposición ante el Consejo de Facultad de Ingeniería Electrónica y Telecomunicaciones, el cual deberá ser interpuesto en la diligencia de notificación o dentro de los diez (10) días hábiles siguientes a la notificación personal o por aviso.`,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'ARTÍCULO TERCERO: ',
                                size: 24,
                                bold: true
                            },
                            ),
                            new TextRun({
                                text: 'Enviar copia de la presente resolución a la División de Gestión del Talento Humano.',
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 200 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `Dada en Popayán, a los ${this.dayInWords(parseInt(this.currentDateDay))} (${this.currentDateDay}) días del mes de ${this.currentDateMonth} del ${this.anioEnPalabra(parseInt(this.currentDateYear))} (${this.currentDateYear}).`,
                                size: 24,
                            },
                            ),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 600 },
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'NOTIFÍQUESE, COMUNÍQUESE Y CÚMPLASE',
                                size: 24,
                                bold: true
                            })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: infoConsolidated.councilPresident,
                                size: 24,
                            })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'El Presidente Consejo de Facultad',
                                size: 24,
                            })
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 300 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'Diligencia de notificación',
                                size: 24,
                            }),
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 150 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: `El señor (a) ______________________________ en la fecha ______________________ del ${this.currentDateYear}, se notificó personalmente la presente resolución`,
                                size: 24,
                            }),
                        ]
                    }),
                    new Paragraph({
                        spacing: { before: 150 },
                        alignment: AlignmentType.JUSTIFIED,
                        children: [
                            new TextRun({
                                text: 'Dado el caso que se proceda a notificar por aviso mediante correo electrónico, se le advierte que esta resolución se considerará notificada al finalizar el segundo día siguiente al de la entrega del correo donde se le enviará la resolución, seguidamente se continuarán con los trámites administrativos procedentes.',
                                size: 24,
                            }),
                        ]
                    }),
                ]
            }
            ]
        });

        Packer.toBlob(document).then(blob => {
            saveAs(blob, `Resolución_$${teacherConsolidated.nombres} ${teacherConsolidated.apellidos}.docx`);
        });
    }

    async getImage(url: string): Promise<ArrayBuffer> {
        const response = await firstValueFrom(this.httpClient.get(url, { responseType: 'arraybuffer' })) as ArrayBuffer;
        return response;
    }

    changeDateFormat(date: Date): string {
        const dayNumber = date.getDate();
        const dayWithOrdinal = `${dayNumber+1}°`;
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        const year = date.getFullYear();
        return  `${dayWithOrdinal} de ${month} de ${year}`;
    }

    getDescritionQualification(qualification: number): string {
        if (qualification >= 91 && qualification <= 100) {
            return 'EXCELENTE';
        } else if (qualification >= 81 && qualification < 91) {
            return 'BUENO';
        } else if (qualification >= 70 && qualification < 81) {
            return 'ACEPTABLE';
        } else {
            return 'Deficiente';
        }
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
