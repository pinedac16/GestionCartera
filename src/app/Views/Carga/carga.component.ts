import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs'
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/components/common/api';
import { ViewChild, ElementRef } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { format } from 'util';
import { CargaService } from '../../Services/Carga/carga.service';
import { UtilService } from '../../Services/Util/util.service';
import * as XLSX from 'xlsx';
import { ReadVarExpr } from '@angular/compiler';

declare var FloatLabels: any;

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;
  msgs: Message[] = [];
  uploadedFile: any = null;
  floatlabels: any;
  arrayBuffer: any;
  data: any;
  body = {
    nit: "1"
  }
 

  constructor(private cargaService: CargaService,
    private translate: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private RequestService: UtilService) { }

  ngOnInit() {

    $(document).ready(function () {
      $('.required').on('change keyup blur', function() {
        if($(this).val() == '')
          $(this).parent().parent().find('p').show();
        else
          $(this).parent().parent().find('p').hide();
      });
    });
  }

  //Método para registrar o actualizar la idea
  Cargar(): void {
    
    //Valida los campos
    $('.required').change();
    
    if (this.fileUpload.files.length == 0)
      $('#valFile').show();
      
    if(($('.has-error:visible').length + $('.has-error-people-picker:visible').length) > 0 )
      return;
      
    
    let fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log(this.data);
    };
    fileReader.readAsBinaryString(this.fileUpload.files[0]);
    
    this.save();
    
  }

  validateFile(): void {
    
  }

  //Método para limpiar el formulario modal
  clear(): void {
    this.uploadedFile = null;
    
    $('.has-error').hide();
    $('#valFile').hide();

    if (this.fileUpload != null)
    {
      this.fileUpload.clear();
      this.fileUpload.msgs = [];
    } 
  }

  save() {
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/POLI/Cliente', this.body, null).subscribe(
      response => {
        console.log(response.body);

        console.log('response', response);
      },
      error => {
        console.log('error', error);
      }
    );

  }

  //Método para tomar el archivo seleccionado a subir
  onBasicUpload(event) {
    this.uploadedFile = event.files[0];
    $('#valFile').hide();
  }

  
  showLoading(msg): void {
    $('#Loading').find('.loaderText').find('h4').html(msg);
    $('#Loading').fadeIn();
  }

  hideLoading(): void {
    $('#Loading').find('.loaderText').find('h4').html('');
    $('#Loading').fadeOut();
  }

  getTemplate(): void{
    window.open('assets/doc/Plantilla_Resumen.docx', '_blank');
  }

}
