import { Injectable, inject } from '@angular/core';
import { PlanService } from './plan.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Plan,
  CreatePlanDto,
  UpdatePlanDto,
  PlanFilters,
  EstadoPlan,
} from '../../models';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlanHelperService {
  private planService = inject(PlanService);
  private baseHelper = inject(BaseHelperService);

  async getById(id: number): Promise<Plan | null> {
    return this.baseHelper.getDataFromResponse(
      this.planService.getPlanById(id)
    );
  }

  // MÉTODOS GÉNERICOS
  getByIdObservable(id: number): Observable<Plan | null> {
    return this.baseHelper.getDataFromResponseObservable(
      this.planService.getPlanById(id)
    );
  }

  async getAll(filters: PlanFilters = {}): Promise<Plan[]> {
    const response = await this.baseHelper.getDataFromResponse(
      this.planService.getPlanes(filters)
    );
    return response?.content || [];
  }

  getAllObservable(filters: PlanFilters = {}): Observable<Plan[]> {
    return this.baseHelper
      .getDataFromResponseObservable(this.planService.getPlanes(filters))
      .pipe(map((response) => response?.content || []));
  }

  // CRUD helpers
  async create(data: CreatePlanDto): Promise<Plan | null> {
    return this.baseHelper.getDataFromResponse(
      this.planService.createPlan(data)
    );
  }

  async update(oidPlan: number, data: UpdatePlanDto): Promise<Plan | null> {
    return this.baseHelper.getDataFromResponse(
      this.planService.updatePlan(oidPlan, data)
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.baseHelper.getDataFromResponse(
      this.planService.deletePlan({ oidPlan: id })
    );
    return result === true;
  }

  // Métodos para usos específicos del dominio

  async getPlanNumero(id: number): Promise<number | null> {
    const plan = await this.getById(id);
    return plan?.numero || null;
  }

  async getPlanAcuerdo(id: number): Promise<string | null> {
    const plan = await this.getById(id);
    return plan?.acuerdo || null;
  }

  async checkPlanExists(id: number): Promise<boolean> {
    const plan = await this.getById(id);
    return plan !== null;
  }

  async getPlanPrograma(id: number): Promise<string | null> {
    const plan = await this.getById(id);
    return plan?.nombrePrograma || null;
  }

  // Helpers para dropdowns y selecciones

  async getAllForDropdown(): Promise<
    { value: number; label: string; estado: EstadoPlan }[]
  > {
    const planes = await this.getAll({ size: 100 });
    return planes.map((plan) => ({
      value: plan.oidPlan,
      label: `Plan ${plan.numero} - ${plan.nombrePrograma}`,
      estado: plan.estado,
    }));
  }

  async getPlanesByPrograma(programaId: number): Promise<Plan[]> {
    return this.getAll({ oidPrograma: programaId, size: 100 });
  }

  async getPlanesByEstado(estado: EstadoPlan): Promise<Plan[]> {
    return this.getAll({ estado, size: 100 });
  }

  async getPlanesActivos(): Promise<Plan[]> {
    return this.getPlanesByEstado('ACTIVO');
  }

  async getPlanesActivosByPrograma(programaId: number): Promise<Plan[]> {
    return this.getAll({
      oidPrograma: programaId,
      estado: 'ACTIVO',
      size: 100,
    });
  }

  async searchByNumero(numero: number): Promise<Plan[]> {
    return this.getAll({ numero, size: 50 });
  }

  async searchByAcuerdo(acuerdo: string): Promise<Plan[]> {
    return this.getAll({ acuerdo, size: 50 });
  }

  // Helpers para validaciones

  async validatePlanActivo(planId: number): Promise<boolean> {
    const plan = await this.getById(planId);
    return plan?.estado === 'ACTIVO';
  }

  async getPlanEstado(planId: number): Promise<EstadoPlan | null> {
    const plan = await this.getById(planId);
    return plan?.estado || null;
  }
}
