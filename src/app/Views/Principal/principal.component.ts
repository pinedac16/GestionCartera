import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UtilService } from '../../Services/Util/util.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(public translate: TranslateService, private fb: FormBuilder, private utilService: UtilService) { }

  
  //Cuando se inicie el componente, se carga el formulario con los campos deseados
  ngOnInit() {
    
  }

  getManual(): void{
    window.open('assets/doc/Plantilla_Resumen.docx', '_blank');
  }

  getDocumentacion(): void {
    window.open('assets/doc/Plantilla_Resumen.docx', '_blank');
  }

  



}
