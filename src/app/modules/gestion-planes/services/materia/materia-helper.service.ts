import { EventEmitter, Injectable, Input, Output, inject } from '@angular/core';
import { MateriaService } from './materia.service';
import { BaseHelperService } from '../base-helper.service';
import {
  Materia,
  CreateMateriaDto,
  UpdateMateriaDto,
  MateriaFilters,
} from '../../models';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MateriaHelperService {
 
}
