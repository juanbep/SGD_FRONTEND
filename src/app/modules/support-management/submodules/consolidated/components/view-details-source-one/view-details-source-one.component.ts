import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actividad, FuenteActividad } from '../../../../../../core/models/consolidated.interface';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Activity, Fuente } from '../../../../../../core/models/activities.interface';
import { tap } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-view-details-source-one',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './view-details-source-one.component.html',
  styleUrl: './view-details-source-one.component.css'
})
export class ViewDetailsSourceOneComponent {


  private consolidatedServices = inject(ConsolidatedServicesService);

  public activity: Activity | null = null;
  public sourceFile: Blob | null = null;
  public reportFile: Blob | null = null;
  public sourceOne: Fuente | undefined = undefined;




  open(oidActividad:number): void {
    const myModal = document.getElementById('view-details-source-one-modal');
    if (myModal) {
      var bootstrapModal = new bootstrap.Modal(myModal);
      this.recoverActivity(oidActividad);     
      bootstrapModal.show();
    }
  }

  recoverActivity(oidActividad:number) {
    this.consolidatedServices.getActivityByOidActivity(oidActividad).pipe(
      tap((actividad: Activity) => {
        this.activity = actividad;
        this.recoverSourceOne();
      } )
    ).subscribe(
      {
        next: (actividad: Activity) => {
          this.activity = actividad;
          this.recoverSourceOne();
        }
      }
    )
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
      this.consolidatedServices.downloadReportFile(this.sourceOne!.oidFuente,true).subscribe((response: Blob) => {
        this.reportFile = response;
      });
    }
  }

  downloadReportFile() {
    if (this.reportFile) {
      const url = window.URL.createObjectURL(this.reportFile);
      const a = document.createElement('a');
      a.href = url;
      a.download =  a.download = this.sourceOne!.nombreDocumentoInforme || '';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }


  adjustFormatDate(date: string): string {
    const dataArray:string[] = date.split('T');
    return `${dataArray[0].split('-').reverse().join('/')} ${dataArray[1].split(':').slice(0,3).join(':')}`;
  }


}
