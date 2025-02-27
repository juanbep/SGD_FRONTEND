import { Component, inject } from '@angular/core';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { CommonModule } from '@angular/common';
import { ConsolidatedServicesService } from '../../../consolidated/services/consolidated-services.service';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
declare var bootstrap: any;

@Component({
  selector: 'cpd-view-details-source-one',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-details-source-one.component.html',
  styleUrl: './view-details-source-one.component.css'
})
export class ViewDetailsSourceOneComponent {

  public activity: ActividadResponse | null = null;
  private consolidatedServices = inject(ConsolidatedServicesService);
  public sourceFile: Blob | null = null;
  public reportFile: Blob | null = null;
  public sourceOne: Fuente | undefined = undefined;


  open(activity: ActividadResponse) {
    const myModal = document.getElementById('view-details-source-one-modal');
    if (myModal) {
      var bootstrapModal = new bootstrap.Modal(myModal);
      this.activity = activity;
      this.recoverSourceOne();
      bootstrapModal.show();
    }
  }

  recoverSourceOne() {
    if (this.activity) {
      this.sourceOne = this.activity.fuentes.find((fuente: Fuente) => fuente.tipoFuente === '1');
      this.recoverFileSourceOne();
      this.recoverReportFile();
    }
  }

  recoverFileSourceOne() {
    if (this.activity) {
      this.consolidatedServices.downloadSourceFile(this.sourceOne!.oidFuente).subscribe((response: Blob) => {
        this.sourceFile = response;
      });
    }
  }

  downloadSourceFile() {
    if (this.sourceFile) {
      const url = window.URL.createObjectURL(this.sourceFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.sourceOne!.nombreDocumentoFuente || '';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }


  recoverReportFile() {
    if (this.activity) {
      this.consolidatedServices.downloadReportFile(this.sourceOne!.oidFuente, true).subscribe((response: Blob) => {
        this.reportFile = response;
      });
    }
  }

  downloadReportFile() {
    if (this.reportFile) {
      const url = window.URL.createObjectURL(this.reportFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = a.download = this.sourceOne!.nombreDocumentoInforme || '';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }


  adjustFormatDate(date: string): string {
    const dataArray: string[] = date.split('T');
    return `${dataArray[0].split('-').reverse().join('/')} ${dataArray[1].split(':').slice(0, 3).join(':')}`;
  }



}
