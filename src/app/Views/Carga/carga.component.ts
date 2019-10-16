import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs'
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/components/common/api';
import { ViewChild, ElementRef } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { Globals } from '../../../globals';
import { Factura, Cliente } from '../../Models/General';
import { format } from 'util';
import { CargaService } from '../../Services/Carga/carga.service';
import { UtilService } from '../../Services/Util/util.service';
import * as XLSX from 'xlsx';
import { ReadVarExpr } from '@angular/compiler';
import { Paths } from '../../class/const/paths';

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
  ListaFacturas: Factura[];
  clientes: Cliente[];
  errorCarga: boolean;
  nombre: String;
  body = {
    nit: "1"
  }
 

  constructor(private cargaService: CargaService,
    private translate: TranslateService,
    private router: Router,
    private globals: Globals,
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
      let facturas: Factura[] = [];
      for(var i = 1; i < this.data.length; i++) {
        if(this.data[i].length == 5) {
            var Factura: Factura = {
              id: 0,
              numero: this.data[i][0],
              fecha: this.data[i][2],
              descripcion: this.data[i][3],
              valor: this.data[i][4],
              idCliente: this.data[i][1],
              Pago: "No",
              Estado: "Sin cita"
            }
            facturas.push(Factura);
        }
        else {
          this.MsgError("La estructura del archivo es incorrecta en la fila " + (i+1));
          return;
        }
      }
      this.ListaFacturas = facturas;
      this.Registrar();
    };
    fileReader.readAsBinaryString(this.fileUpload.files[0]);
    
    
    
  }

  MsgError(msg: string): void {
    this.confirmationService.confirm({
      message: msg,
      header: 'Error',
      icon: 'fas fa-info-circle',
      acceptLabel: 'Aceptar',
      rejectVisible: false,
      accept: () => {
        
      }
    });
    this.clear();
    
  }

  MsgExito(msg: string): void {
    this.confirmationService.confirm({
      message: msg,
      header: 'Satisfactorio',
      icon: 'fas fa-info-circle',
      acceptLabel: 'Aceptar',
      rejectVisible: false,
      accept: () => {
        
      }
    });
    this.clear();
    
  }


  Registrar(): void {
    var error: boolean = false;
    for(var i = 0; i < this.ListaFacturas.length; i++) {
      var factura: Factura = {
        id: 0,
        numero: this.ListaFacturas[i].numero,
        fecha: this.ListaFacturas[i].fecha,
        descripcion: this.ListaFacturas[i].descripcion,
        valor: this.ListaFacturas[i].valor,
        idCliente: this.ListaFacturas[i].idCliente,
        Pago: this.ListaFacturas[i].Pago,
        Estado: this.ListaFacturas[i].Estado
      }
      this.RequestService.httpRequest('POST',  `${Paths.URL}/Factura/newFactura`, factura, null).subscribe(
      response => {
        if(response.body != "Ok") {
          error = true;
        }
      },
      error => {
        console.log('error', error);
      });
    }
    if(error) {
      this.MsgError("Se ha producido un error al cargar los datos");
    }
    else {
      this.MsgExito("Se han cargado las facturas correctamente.");
    }
    
    
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
    window.open('assets/Doc/Facturas.xlsx', '_blank');
  }

}
