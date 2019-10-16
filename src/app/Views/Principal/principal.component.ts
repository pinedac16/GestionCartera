import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UtilService } from '../../Services/Util/util.service';
import { CargaService } from '../../Services/Carga/carga.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(
    public translate: TranslateService, 
    private fb: FormBuilder, 
    private utilService: UtilService,
    private router: Router,
    private carga: CargaService
  ) { }

  
  //Cuando se inicie el componente, se carga el formulario con los campos deseados
  ngOnInit() {
    if (!this.carga.isLogin) {
      this.router.navigate(['/Login']);
    }

  }

  getDocumentacion(): void {
    window.open('assets/Doc/PRESENTACION.pptx', '_blank');
  }

  



}
