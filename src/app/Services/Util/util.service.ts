import { Injectable } from '@angular/core';
import { Cliente } from '../../Models/General';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  cliente: Cliente[];
  constructor(public httpClient: HttpClient) { }

  public httpRequest(typeRequest: string, url: string, bodyRequest?: any, queryString?: any, headers?: any): Observable<any> {
    return this.httpClient.request(typeRequest, url, { body: bodyRequest, observe: 'response', params: queryString, headers})
      .pipe(
        catchError(error => {
        return error;
      }));
  }

  getClientes(): void {
    
    // try {
      
    //   return (r => {
    //     let listLookup: Cliente[] = [];

    //     for(var i=0; i < r.length; i++) {
    //       var list: Cliente = {
    //         Id: r[i].codigo,
    //         NIT: r[i].nit,
    //         Nombre: r[i].nombre,
    //         Direccion: r[i].direccion,
    //         Telefono: r[i].telefono,
    //         Municipio: r[i].municipio

    //       }
    //       listLookup.push(list);
    //     }
        
    //     return listLookup;
    //   }).catch(err => {
    //     throw err;
    //   });
    // }
    // catch(err)
    // {
    //   throw err;
    // }
  }

}
