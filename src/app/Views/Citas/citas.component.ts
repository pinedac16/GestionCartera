import { Component, OnInit } from '@angular/core';
import { from, Subject, observable } from 'rxjs'
import { Router } from '@angular/router';
import { Cliente, Cita, Factura } from '../../Models/General';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../../globals';
import { ViewChild, ElementRef } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/api';
import { format } from 'util';
import { CitasService } from "../../Services/Citas/citas.service";
import { UtilService } from '../../Services/Util/util.service';

declare var FloatLabels: any;

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('closeAddExpenseModalSeg') closeAddExpenseModalSeg: ElementRef;
  @ViewChild('closeAddExpenseModalCom') closeAddExpenseModalCom: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('openModalSeg') openModalSeg: ElementRef;
  @ViewChild('openModalCom') openModalCom: ElementRef;

  msgs: Message[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  floatlabels: any;
  mensajeGrupoSeguridad: string = '';
  headerGrupoSeguridad: string = '';
  mensajeBotonAceptar: string = '';
  ListaClientes: Cliente[];
  ListaCitas: Cita[];
  cita: Cita = new Cita();
  ListaFacturas: Factura[];
  Factura: Factura = new Factura();
  editCita: boolean;
  body = {
    id: "1"
  }


  constructor(private translate: TranslateService,
    private router: Router,
    private globals: Globals,
    private confirmationService: ConfirmationService,
    private citasService: CitasService,
    private RequestService: UtilService) { }

  ngOnInit() {

    this.translate.get('Citas_Mensaje_Confirmacion_Borrar').subscribe(msg => {
      this.globals.MensajeConfirmBorrado = msg;
      this.mensajeBotonAceptar = this.translate.instant('General_Boton_Aceptar');
    });

    this.dtOptions = {
      "language": {
        
      },
      'searching': true,
      'lengthChange': false,
      'processing': true,
      'paging': true,
      'info': true,
      "scrollX": true,
      'initComplete': function () {
        $('#spLoading').fadeOut();
        $('.dataTables_filter').find('input').addClass('form-control-grid');
        $('#dvTable').fadeIn();
        $('#tblLista').DataTable().columns.adjust();
      }
    };

    setTimeout(() => {
      this.translate.get('Citas_modal_Fecha').subscribe(trans => {
        $('#lblFecha').html(trans);
        $('#lblObjetivo').html(this.translate.instant('Citas_modal_Objetivo'));
        $('#lblObservaciones').html(this.translate.instant('Citas_modal_Observaciones'));
        $('#lblFechaSeg').html(this.translate.instant('Citas_modal_Fecha'));
        $('#lblObjetivoSeg').html(this.translate.instant('Citas_modal_Objetivo'));
        $('#lblObservacionesSeg').html(this.translate.instant('Citas_modal_Observaciones'));
        $('#lblResultado').html(this.translate.instant('Citas_modal_Resutado'));
        this.floatlabels = new FloatLabels('.form-1', {
          style: 1
        });
      });
    }, 250);

    this.getTables();
    $(document).ready(function () {
      $('.required').on('change keyup blur', function() {
        if($(this).val() == '')
          $(this).parent().parent().find('p').show();
        else
          $(this).parent().parent().find('p').hide();
      });
    });

  }

  //Método para consultar los usuarios registrados
  getTables(): void {
    
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/allFactura', this.body, null).subscribe(
      response => {
        let facturas: Factura[] = [];
        console.log(response.body)
        for (var i = 0; i < response.body.length; i++) {
          
          var Factura: Factura = {
            id: response.body[i].id,
            numero: response.body[i].numero,
            fecha: response.body[i].fecha,
            descripcion: response.body[i].descripcion,
            valor: response.body[i].valor,
            idCliente: response.body[i].idCliente,
            Pago: "No",
            Estado: response.body[i].estado
          }
          facturas.push(Factura);
        }
        this.ListaFacturas = facturas;
        
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      },
      error => {
        console.log('error', error);
      });
  }

  //Método para traer la información general del formulario modal
  getInfoModal(): void {
  }

  msgError(error): void {
    this.msgs = [];
    var msg = format(this.globals.MsgError, error);
    this.msgs.push({ severity: 'error', summary: this.globals.TituloMsgError, detail: msg });
  }

  showLoading(msg): void {
    $('#Loading').find('.loaderText').find('h4').html(msg);
    $('#Loading').fadeIn();
  }

  hideLoading(): void {
    $('#Loading').find('.loaderText').find('h4').html('');
    $('#Loading').fadeOut();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    
  }

  //Método para limpiar el formulario modal
  clearModalForm(): void {
    this.cita = new Cita();
    this.editCita = false;
    $('#txtFecha').val('');
    $('#txtObjetivo').val('');
    $('#txtObservaciones').val('');
    
    $('.has-error').hide();

    this.floatlabels.rebuild();
  }

  clearModalFormSeg(): void {
    this.cita = new Cita();
    $('#txtFechaSeg').val('');
    $('#txtObjetivoSeg').val('');
    $('#txtObservacionesSeg').val('');
    $('#txtResultado').val('');
    
    $('.has-error').hide();

    this.floatlabels.rebuild();
  }

  createCitas(idFactura: string): void {
    this.cita.idFactura = idFactura;
    this.floatlabels.rebuild();
    this.openModal.nativeElement.click();
    
  }

  Completar(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Objetivo = $("#txtObjetivoSeg").val().toString();
    var Observaciones = $("#txtObservacionesSeg").val().toString();
    var Fecha = $("#txtFechaSeg").val().toString().replace('T', ' ') + ":00";
    var Resultado = $("#txtResultado").val().toString();
   
    this.cita.id = 0;
    this.cita.objetivo = Objetivo;
    this.cita.fecha = Fecha;
    this.cita.resultado = Resultado;
    this.cita.observaciones = Observaciones;
    
    console.log(this.cita);
    this.translate.get('Citas_Creando_resultado').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/completadoCita', this.cita, null).subscribe(
      response => {
        this.translate.get('Citas_Exito_Crear_resultado').subscribe(msg => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: this.globals.TituloMsgSuccess, detail: msg });
        });

        $('#dvTable').fadeOut();
        $('#spLoading').fadeIn();
        $('#tblLista').DataTable().destroy();
        this.getTables();
        this.hideLoading();

        this.clearModalFormSeg();
        this.closeAddExpenseModalSeg.nativeElement.click();
                
      },
      error => {
        console.log('error', error);
      });
  }

  Editar(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Objetivo = $("#txtObjetivo").val().toString();
    var Observaciones = $("#txtObservaciones").val().toString();
    var Fecha = $("#txtFecha").val().toString().replace('T', ' ') + ":00";
   
    this.cita.id = 0;
    this.cita.objetivo = Objetivo;
    this.cita.fecha = Fecha;
    this.cita.resultado = "";
    this.cita.observaciones = Observaciones;
    
    console.log(this.cita);
    this.translate.get('Citas_Actualizando_cita').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/updateCita', this.cita, null).subscribe(
      response => {
        this.translate.get('Citas_Exito_Actualizando_Cita').subscribe(msg => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: this.globals.TituloMsgSuccess, detail: msg });
        });

        $('#dvTable').fadeOut();
        $('#spLoading').fadeIn();
        $('#tblLista').DataTable().destroy();
        this.getTables();
        this.hideLoading();

        this.clearModalForm();
        this.closeAddExpenseModal.nativeElement.click();
                
      },
      error => {
        console.log('error', error);
      });

  }

  VerInfo(idFactura: string) : void {
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/Cita', idFactura, null).subscribe(
      response => {
        console.log(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtFechaCom').val(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtObjetivoCom').val(response.body.objetivo);
        $('#txtObservacionesCom').val(response.body.observaciones);
        $('#txtResultadoCom').val(response.body.resultado);
        this.cita.idFactura = idFactura.toString();
        this.editCita = true;
        this.floatlabels.rebuild();
        this.openModalCom.nativeElement.click();
  
      },
      error => {
        console.log('error', error);
      });
  }

  Registrar(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Objetivo = $("#txtObjetivo").val().toString();
    var Fecha = $("#txtFecha").val().toString().replace('T', ' ') + ":00";
   
    this.cita.id = 0;
    this.cita.objetivo = Objetivo;
    this.cita.fecha = Fecha;
    this.cita.resultado = "";
    this.cita.observaciones = "";
    
    console.log(this.cita);
    this.translate.get('Citas_Creando_cita').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/newcita', this.cita, null).subscribe(
      response => {
        this.translate.get('Citas_Exito_Crear_Cita').subscribe(msg => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: this.globals.TituloMsgSuccess, detail: msg });
        });

        $('#dvTable').fadeOut();
        $('#spLoading').fadeIn();
        $('#tblLista').DataTable().destroy();
        this.getTables();
        this.hideLoading();

        this.clearModalForm();
        this.closeAddExpenseModal.nativeElement.click();
                
      },
      error => {
        console.log('error', error);
      });
    
  }

  editCitas(idFactura: number): void {
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/Cita', idFactura, null).subscribe(
      response => {
        console.log(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtFecha').val(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtObjetivo').val(response.body.objetivo);
        $('#txtObservaciones').val(response.body.observaciones);
        this.cita.idFactura = idFactura.toString();
        this.editCita = true;
        this.floatlabels.rebuild();
        this.openModal.nativeElement.click();
  
      },
      error => {
        console.log('error', error);
      });
    
  }

  crearResultado(idFactura: string):void {
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/Cita', idFactura, null).subscribe(
      response => {
        console.log(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtFechaSeg').val(response.body.fecha.replace(':00.0', '').replace(' ', 'T'));
        $('#txtObjetivoSeg').val(response.body.objetivo);
        $('#txtObservacionesSeg').val(response.body.observaciones);
        this.cita.idFactura = idFactura.toString();
        this.floatlabels.rebuild();
        this.openModalSeg.nativeElement.click();
  
      },
      error => {
        console.log('error', error);
      });
  }

  Seguimiento(id: number): void {
    this.floatlabels.rebuild();
    this.openModalSeg.nativeElement.click();
  }

  Proceso(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Objetivo = $("#txtObjetivoSeg").val().toString();
    var Observaciones = $("#txtObservacionesSeg").val().toString();
    var Fecha = $("#txtFechaSeg").val().toString().replace('T', ' ') + ":00";
    var Resultado = $("#txtResultado").val().toString();
   
    this.cita.id = 0;
    this.cita.objetivo = Objetivo;
    this.cita.fecha = Fecha;
    this.cita.resultado = Resultado;
    this.cita.observaciones = Observaciones;
    
    console.log(this.cita);
    this.translate.get('Citas_Creando_proceso').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/procesosCita', this.cita, null).subscribe(
      response => {
        this.translate.get('Citas_Exito_Crear_proceso').subscribe(msg => {
          this.msgs = [];
          this.msgs.push({ severity: 'success', summary: this.globals.TituloMsgSuccess, detail: msg });
        });

        $('#dvTable').fadeOut();
        $('#spLoading').fadeIn();
        $('#tblLista').DataTable().destroy();
        this.getTables();
        this.hideLoading();

        this.clearModalFormSeg();
        this.closeAddExpenseModalSeg.nativeElement.click();
                
      },
      error => {
        console.log('error', error);
      });
  }


}
