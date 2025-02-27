import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Utilities } from '../../utils/utilities';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
declare var bootstrap: any;

@Component({
  selector: 'app-view-details-source-two',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-details-source-two.component.html',
  styleUrl: './view-details-source-two.component.css'
})
export class ViewDetailsSourceTwoComponent {

  private consolidatedServices = inject(ConsolidatedServicesService);
  private utilities = inject(Utilities);

  public activity: ActividadResponse | null = null;
  public sourceTwo: Fuente | undefined = undefined;
  public sourceFile: Blob | null = null;

  open(oidActividad:number): void {
    const myModal = document.getElementById('view-details-source-two-modal');
    if (myModal) {
      var bootstrapModal = new bootstrap.Modal(myModal);
      this.recoverActivity(oidActividad);
      bootstrapModal.show();
    }
  }

  recoverActivity(oidActividad:number) {
    this.consolidatedServices.getActivityByOidActivity(oidActividad).subscribe(
      {
        next: (actividad: ActividadResponse) => {
          this.activity = actividad;
          this.recoverSourceTwo();
         
        }
      }
    )
  }

  recoverSourceTwo() {
    if (this.activity) {
      this.sourceTwo = this.activity.fuentes.find(fuente => fuente.tipoFuente === '2');
      this.recoverFileSourceTwo();
    }
  }

  recoverFileSourceTwo() {
    this.consolidatedServices.downloadSourceFile(this.sourceTwo!.oidFuente).subscribe((response: Blob) => {
      this.sourceFile = response;
    });
  }

  downloadSourceFile() {
    if(this.sourceFile) {
      const url = window.URL.createObjectURL(this.sourceFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.sourceTwo!.nombreDocumentoFuente || 'Documento';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }

  }

  adjustFormatDate(date: string): string {
    return this.utilities.adjustFormatDate(date);
  }

}
