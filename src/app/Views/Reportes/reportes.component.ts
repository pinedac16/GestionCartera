import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  data = [
    {
      'id': 1,
      'numeroFactura': '4131',
      'fecha': '2019-10-10',
      'descripcion': 'compra 1',
      'valor': '500000',
      'idCliente': 'empresa 1',
      'estado': 'Con cita'
    },
    {
      'id': 2,
      'numeroFactura': '92848',
      'fecha': '2019-10-11',
      'descripcion': 'compra 2',
      'valor': '600000',
      'idCliente': 'empresa2',
      'estado': 'Sin cita'
    },
    {
      'id': 3,
      'numeroFactura': '91111',
      'fecha': '2019-10-11',
      'descripcion': 'compra 2',
      'valor': '50000',
      'idCliente': 'empresa 1',
      'estado': 'Sin cita'
    },
    {
      'id': 4,
      'numeroFactura': '91111',
      'fecha': '2019-10-11',
      'descripcion': 'compra 2',
      'valor': '50000',
      'idCliente': 'empresa 5',
      'estado': 'report'
    }
  ];

  dataConReport = [ ];

  dataSinMora = [ ];

  constructor() { }

  ngOnInit() {
    this.sinMora(this.data);
  }

  sinMora(data: any) {
    const dataSinMora = [];
    const dataConReport = [{label: 'Clientes', A: 0, B: 0 }];

    data.forEach(element => {
      const item = { label: '', value: 0 };
      const pos = this.searchItem(element.idCliente, dataSinMora);
      if (pos !== -1) {
        dataSinMora[pos].value += +element.valor;
      } else {
        item.label = element.idCliente;
        item.value = +element.valor;
        dataSinMora.push(item);
      }

      if (element.estado === 'report') {
        dataConReport[0].B += 1;
      } else {
        dataConReport[0].A += 1;
      }

    });
    this.dataConReport = dataConReport;
    this.dataSinMora = dataSinMora;
  }

  searchItem(item, arr: any) {
    let found = -1;
    arr.forEach((element, i) => {
      if (element.label === item) {
        found = i;
      }
    });
    return found;
  }



}
