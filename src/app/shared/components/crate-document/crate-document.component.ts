import { Component, inject } from '@angular/core';
import { WordGeneratorService } from '../../services/word-generator.service';

@Component({
  selector: 'app-crate-document',
  standalone: true,
  imports: [
  ],
  templateUrl: './crate-document.component.html',
  styleUrl: './crate-document.component.css'
})
export class CrateDocumentComponent {

  private _wordGeneratorService: WordGeneratorService = inject(WordGeneratorService);

  public buldDocument(){
    this._wordGeneratorService.generateWordDocument();
  }
}
