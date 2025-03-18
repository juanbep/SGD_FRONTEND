import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';

@Component({
	selector: 'reponsibilities-edit-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
	templateUrl: './reponsibilities-edit-form.component.html',
	styleUrls: ['./reponsibilities-edit-form.component.css']
})
export class ReponsibilitiesEditFormComponent implements OnInit {

	@ViewChild(ConfirmDialogComponent)
	confirmDialog: ConfirmDialogComponent | null = null;


	private formBuilder: FormBuilder = inject(FormBuilder);
	private activatedRoute = inject(ActivatedRoute);
	private responsibilitiesService = inject(ResponsibilitiesServicesService);
	private messagesInfoService = inject(MessagesInfoService);
	private router = inject(Router);

	public messageTitle: string = MESSAGE_TITLE;
	public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;

	formEvaluation: FormGroup = this.formBuilder.group({
		// ...existing code...
		degreeWorkTitle: [null, [Validators.required]],
		developmentStage: [null, [Validators.required]],
		qualification_1: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_2: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_3: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_4: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_5: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_6: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_7: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		qualification_8: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
		observations: [''],
		studentSignature: ['', [Validators.required]]
	});

	responsibility: any = null;
	totalAverage: number | null = null;
	public errorCalification: boolean = false;
	public allCompleted: boolean = false;

	ngOnInit(): void {
		const id = this.activatedRoute.snapshot.params['id'];
		this.loadResponsibility(id);
		this.onQualificationChanges();
	}

	loadResponsibility(id: number) {
		if (id) {
			this.responsibilitiesService.getResponsibilitieById(id).subscribe({
				next: (resp) => {
					this.responsibility = resp;
					this.patchForm();
				},
				error: (err) => {
					this.messagesInfoService.showErrorMessage(err.error.mensaje, 'Error');
				}
			});
		}
	}

	patchForm() {
		// Se asume que la fuente a editar es la segunda (índice 1) del arreglo 'fuentes'
		this.formEvaluation.patchValue({
			degreeWorkTitle: this.responsibility.degreeWorkTitle,
			developmentStage: this.responsibility.developmentStage,
			qualification_1: this.responsibility.fuentes[1]?.calificacion || '',
			qualification_2: this.responsibility.fuentes[1]?.qualification_2 || '',
			qualification_3: this.responsibility.fuentes[1]?.qualification_3 || '',
			qualification_4: this.responsibility.fuentes[1]?.qualification_4 || '',
			qualification_5: this.responsibility.fuentes[1]?.qualification_5 || '',
			qualification_6: this.responsibility.fuentes[1]?.qualification_6 || '',
			qualification_7: this.responsibility.fuentes[1]?.qualification_7 || '',
			qualification_8: this.responsibility.fuentes[1]?.qualification_8 || '',
			observations: this.responsibility.fuentes[1]?.observations || '',
			studentSignature: this.responsibility.fuentes[1]?.studentSignature || ''
		});
		this.computeAverage();
	}

	onQualificationChanges() {
		['qualification_1','qualification_2','qualification_3','qualification_4',
		 'qualification_5','qualification_6','qualification_7','qualification_8'
		].forEach(field => {
			this.formEvaluation.get(field)?.valueChanges.subscribe(() => this.computeAverage());
		});
	}

	computeAverage() {
		const fields = ['qualification_1','qualification_2','qualification_3','qualification_4','qualification_5','qualification_6','qualification_7','qualification_8'];
		const values = fields.map(f => Number(this.formEvaluation.get(f)?.value));
		const sum = values.reduce((a, b) => a + b, 0);
		this.totalAverage = sum / fields.length;
	}

	saveEdit() {
		if (this.formEvaluation.invalid) {
			this.messagesInfoService.showWarningMessage('Complete los campos correctamente', 'Advertencia');
			return;
		}
		// Llamar al servicio para actualizar la evaluación
		console.log('Guardando evaluación editada:', this.formEvaluation.value);
		// ...existing update logic...
	}

	qualitativeEquivalent(evaluation: string | null): string {
		if (evaluation === null || evaluation === '') return '';
		const evaluationNumber = Number(evaluation);
		if (evaluationNumber < 70) return 'Deficiente';
		if (evaluationNumber < 80) return 'Aceptable';
		if (evaluationNumber < 90) return 'Bueno';
		return 'Sobresaliente';
	}

	triggersSignatureFileUpload() {
		const fileUpload = document.getElementById('studentSignature') as HTMLInputElement;
		if (fileUpload) {
			fileUpload.click();
		}
	}

	onSignatureFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				const base64String = reader.result?.toString() || '';
				this.formEvaluation.get('studentSignature')?.setValue(base64String);
				console.log(base64String);
			};
			reader.readAsDataURL(file);
		}
	}

	deleteFile() {
		this.formEvaluation.get('studentSignature')?.setValue(null);
	}

	downloadFile() {
		const file = this.formEvaluation.get('studentSignature')?.value;
		if (file) {
			const blob = this.dataURLtoBlob(file);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'firma.png';
			a.click();
		}
	}

	dataURLtoBlob(dataurl: string): Blob {
		const arr = dataurl.split(',');
		const mime = arr[0].match(/:(.*?);/)![1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	}

	cancelOption(){
		this.confirmDialog?.open();
	}

	onConfirmCancel(confirm: boolean) {
		if (confirm) {
			this.router.navigate(['./app/']);
		}
	}
}