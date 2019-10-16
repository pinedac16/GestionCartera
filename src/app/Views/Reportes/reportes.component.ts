import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../Services/Util/util.service';
import { Paths } from '../../class/const/paths';
import { Router } from '../../../../node_modules/@angular/router';
import { CargaService } from '../../Services/Carga/carga.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  isLoading = false;
  isGrafig = false;
  titles = ['id', 'idCliente', 'numeroFactura', 'fecha', 'descripcion', 'valor', 'estado'];
  valueInpiut = [];
  data = [];
  dataFilter = [];
  dataConReport = [];

  dataSinMora = [];

  constructor(
    private router: Router,
    private carga: CargaService,
    private RequestService: UtilService
  ) { }

  ngOnInit() {
    if (!this.carga.isLogin) {
      this.router.navigate(['/Login']);
    }
    this.isLoading = true;
    this.getData();
    this.clearInput();

  }

  getData() {
    this.RequestService.httpRequest('POST', `${Paths.URL}/Factura/allFactura`, {}, null)
      .subscribe(
        response => {
          this.data = response.body;
          this.dataFilter = this.data;
          this.sinMora(this.data);

          console.log();
          this.isLoading = false;
          this.isGrafig = true;
        },
        error => {
          console.log(error);
          this.isLoading = false;
        }
      );
  }

  sinMora(data: any) {
    const dataSinMora = [];
    const dataConReport = [{ label: 'Clientes', A: 0, B: 0 }];

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

      if (this.enMora(element.fecha)) {
        dataConReport[0].B += 1;
      } else {
        dataConReport[0].A += 1;
      }

    });
    this.dataConReport = dataConReport;
    this.dataSinMora = dataSinMora;
  }

  enMora(date) {
    const dateN = new Date(date);
    const fechaFac = dateN.setDate(dateN.getDate() + 90);

    if (new Date().getTime() > fechaFac) {
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }

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


  filterItem(index) {
    this.clearInput();
    this.isGrafig = false;
    this.dataFilter = [];
    this.dataConReport = [];
    this.dataSinMora = [];
    this.dataFilter = this.data.filter(
      item => `${item[this.titles[index]]}`.toLowerCase().indexOf(this.valueInpiut[index].toLowerCase()) > -1
    );

    this.sinMora(this.dataFilter);
    setTimeout(() => {
      this.isGrafig = true;
    }, 1000);
  }

  clearInput(){

    this.valueInpiut.forEach(element => {
      element = '';    });
  }




}
