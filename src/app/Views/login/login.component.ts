import { Component, OnInit } from '@angular/core';
import { CargaService } from '../../Services/Carga/carga.service';
import { Router } from '@angular/router';
import { UtilService } from '../../Services/Util/util.service';
import { Paths } from '../../class/const/paths';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  username: string;
  password: string;
  isError = false;

  constructor(
    private carga: CargaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private RequestService: UtilService
  ) { }

  ngOnInit() {
    this.isLoading = false;
    console.log(this.username);
  }

  login(){
    this.isLoading = true;
    const body = {
      username: this.username,
      password: this.password
    };

    this.RequestService.httpRequest('POST', `${Paths.URL}/Factura/Usuario`, body, null).subscribe(
      response => {
        console.log(response.body.status);
        if (response.body.status) {
          this.carga.name = response.body.name;
          this.carga.isLogin = true;
          this.router.navigate(['/Principal']);
        } else {
          this.isError = true;
          this.carga.isLogin = false;
        }
        this.isLoading = false;
      },
      error => {
        this.isError = true;
        this.carga.isLogin = false;
        this.isLoading = false;
      }
    );

    
  }

  recordarContrasena(): void {
    const body = {
      username: this.username,
      password: this.password
    };
    console.log(this.username);
    this.RequestService.httpRequest('POST', `${Paths.URL}/Factura/recordarPass`, body, null).subscribe(
      response => {
        if(response.body.password != "Error") {
          this.confirmationService.confirm({
            message: "Su contraseña es: " + response.body.password,
            header: 'Recordar contraseña',
            icon: 'fas fa-info-circle',
            acceptLabel: 'Aceptar',
            rejectVisible: false,
            accept: () => {
              
            }
          });
        }
        else{
          this.confirmationService.confirm({
            message: "Usuario no existe",
            header: 'Recordar contraseña',
            icon: 'fas fa-info-circle',
            acceptLabel: 'Aceptar',
            rejectVisible: false,
            accept: () => {
              
            }
          });
        }
        
      },
      error => {
        
      }
    );
  }

}
