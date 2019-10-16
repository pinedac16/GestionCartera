import { Component, OnInit } from '@angular/core';
import { from, Subject, observable } from 'rxjs'
import { Router } from '@angular/router';
import { Proceso, Cita, Factura } from '../../Models/General';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../../globals';
import { ViewChild, ElementRef } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/api';
import { format } from 'util';
import { UtilService } from '../../Services/Util/util.service';

declare var FloatLabels: any;

@Component({
  selector: 'app-proceso-juridico',
  templateUrl: './proceso-juridico.component.html',
  styleUrls: ['./proceso-juridico.component.css']
})
export class ProcesoJuridicoComponent implements OnInit {

  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;

  //Variables utilizadas
  msgs: Message[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  floatlabels: any;
  mensajeGrupoSeguridad: string = '';
  headerGrupoSeguridad: string = '';
  mensajeBotonAceptar: string = '';
  ListaFacturas: Factura[];
  editProceso: boolean;
  proceso: Proceso = new Proceso();
  body = {
    id: "1"
  }

  //Constructor
  constructor(private translate: TranslateService,
    private router: Router,
    private globals: Globals,
    private confirmationService: ConfirmationService,
    private RequestService: UtilService) { }

    //Inicialización del formulario
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
      this.translate.get('Procesos_modal_Observaciones').subscribe(trans => {
        $('#txtObservaciones').html(trans);
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
  //Método para consultar las facturas para realizar proceso jurídico
  getTables(): void {
    
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/FacturasProceso', this.body, null).subscribe(
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
            Pago: "",
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

  //Mensaje general de error
  msgError(error): void {
    this.msgs = [];
    var msg = format(this.globals.MsgError, error);
    this.msgs.push({ severity: 'error', summary: this.globals.TituloMsgError, detail: msg });
  }

  //Mostrar mensaje cargando
  showLoading(msg): void {
    $('#Loading').find('.loaderText').find('h4').html(msg);
    $('#Loading').fadeIn();
  }

  //Esconder mensaje cargando
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
    this.proceso = new Cita();
    this.editProceso = false;
    $('#txtObservaciones').val('');
    
    $('.has-error').hide();

    this.floatlabels.rebuild();
  }

  //Metodo para abrir el formulario para crear un nuevo proceso jurídico
  crearProceso(idFactura: string): void {
    this.proceso.idFactura = idFactura;
    this.floatlabels.rebuild();
    this.openModal.nativeElement.click();
  }

  //Metodo para abrir el formulario de editar el proceso jurídico
  editProcesos(idFactura: number): void {
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/Proceso', idFactura, null).subscribe(
      response => {
        $('#txtObservaciones').val(response.body.observaciones);
        this.proceso.id = response.body.id;
        this.proceso.idFactura = idFactura.toString();
        this.editProceso = true;
        this.floatlabels.rebuild();
        this.openModal.nativeElement.click();
  
      },
      error => {
        console.log('error', error);
      });
    
  }

  //Metodo para editar el proceso jurídico
  Editar(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Observaciones = $("#txtObservaciones").val().toString();
   
    this.proceso.id = 0;
    this.proceso.observaciones = Observaciones;
    
    this.translate.get('Citas_Actualizando_cita').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/updateProceso', this.proceso, null).subscribe(
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

  Registrar(): void {
    $('.requiered').change();

    if(($('.has-error:visible').length) > 0) {
      return;
    }

    var Observaciones = $("#txtObservaciones").val().toString();
   
    this.proceso.id = 0;
    this.proceso.observaciones = Observaciones;
    
    this.translate.get('Citas_Creando_cita').subscribe(msg => {
      this.showLoading(msg);
    });
    this.RequestService.httpRequest('POST', 'http://localhost:1024/servicesREST/Factura/newProceso', this.proceso, null).subscribe(
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

}
