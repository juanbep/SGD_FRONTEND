import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActividadesService } from '../../services/actividades.service';
import {
  ActividadFilters,
  PaginationConfig,
  DEFAULT_PAGINATION_CONFIG,
  ActividadResponse,
} from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-activities-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-activities-component.component.html',
  styleUrl: './view-activities-component.component.css',
})
export class ViewActivitiesComponentComponent implements OnInit {
  private actividadesService = inject(ActividadesService);
  private toastr = inject(ToastrService);

  actividades: ActividadResponse[] = [];
  loading = false;
  pagination: PaginationConfig = { ...DEFAULT_PAGINATION_CONFIG };

  filters: ActividadFilters = {
    page: 0,
    size: 10,
  };

  ngOnInit(): void {
    this.loadActividades();
  }

  loadActividades(): void {
    this.loading = true;

    this.actividadesService.getActividades(this.filters).subscribe({
      next: (response) => {
        if (response.codigo === 200) {
          this.actividades = response.data.content;
          //console.log(this.actividades)
          this.updatePagination(response.data);
          this.toastr.success(
            response.mensaje || 'Actividades cargadas correctamente'
          );
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error(
          'Error al cargar actividades',
          error.message || 'Error desconocido'
        );
        this.loading = false;
        this.actividades = [];
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.pagination.totalPages) {
      this.filters.page = page;
      this.loadActividades();
    }
  }

  onPageSizeChange(): void {
    this.filters.page = 0; // Reset to first page
    this.loadActividades();
  }

  trackByOid(index: number, item: ActividadResponse): number {
    return item.actividad.oidActividad;
  }

  private updatePagination(data: any): void {
    this.pagination = {
      ...this.pagination,
      currentPage: data.number,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      pageSize: data.size,
    };
  }
}
