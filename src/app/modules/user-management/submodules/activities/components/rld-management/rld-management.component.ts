import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'rld-management',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './rld-management.component.html',
  styleUrl: './rld-management.component.css'
})
export class RldManagementComponent implements OnInit {

  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  private activitiesMagementService = inject(ActivitiesManagementService);
  private messageInfoService = inject(MessagesInfoService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);




  @Input() idUser: number | null = null;

  public RLDFile: File | null = null;
  public fileRLDUrl: string | null = null;
  public academicPeriod: PeriodoAcademicoResponse | null = null;


  ngOnInit(): void {
    this.academicPeriod = this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.recoverRLDFile();
  }


  recoverRLDFile() {
    if (this.idUser) {
      this.activitiesMagementService.getRLD(this.idUser).subscribe(
        {
          next: (blob) => {
            const file = new File([blob], 'RLD.pdf', { type: 'application/pdf' });
            this.RLDFile = file;
          },
          error: (error) => {
          }
        }
      );
    }
  }

  triggersRLDFileUpload() {
    const fileUpload = document.getElementById(
      'userRLD'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onRLDFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.RLDFile = file;
      this.uploadRLD();
    }
  }


  uploadRLD() {
    if (this.RLDFile && this.idUser) {
      this.activitiesMagementService.uploadRLD(this.idUser, this.RLDFile).subscribe(
        {
          next: (response) => {
            this.messageInfoService.showSuccessMessage(
              'El archivo RLD se ha cargado correctamente.',
              'Éxito'
            );
          },
          error: (error) => {
            this.messageInfoService.showErrorMessage(
              error.error.mensaje,
              'Error'
            );
            this.deleteRLDFile();
          },
        }
      );
    } else {
      this.messageInfoService.showErrorMessage(
        'Por favor, seleccione un archivo para cargar.',
        'Error'
      );
    }
  }


  previewFile() {
    const reader = new FileReader();
    reader.readAsDataURL(this.RLDFile as Blob);
    reader.onload = () => {
      const base64String = reader.result as string;
      this.fileRLDUrl = base64String.split(',')[1]; // Obtener solo la parte base64
      this.fileRLDUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64String) as string;
    };
    reader.onerror = (error) => {
      this.messageInfoService.showErrorMessage(
        'Error al leer el archivo: ' + error,
        'Error'
      );
    }
  }

  deleteRLDFile() {
    this.RLDFile = null;
    this.fileRLDUrl = null;
    this.uploadRLD();

  }


}
