import { Component, OnInit } from '@angular/core';
import { CargaService } from '../../Services/Carga/carga.service';
import { Router } from '@angular/router';
import { UtilService } from '../../Services/Util/util.service';
import { Paths } from '../../class/const/paths';

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
    private RequestService: UtilService
  ) { }

  ngOnInit() {
  }

  login(){
    this.isLoading = true;
    const body = {
      username: this.username,
      password: this.password
    };

    // this.RequestService.httpRequest('POST', `${Paths.URL}/lgin`, body, null).subscribe(
    //   response => {
    //     if (response.status) {
    //       this.carga = response.name;
    //       this.carga.isLogin = true;
    //       this.router.navigate(['/Principal']);
    //     } else {
    //       this.isError = true;
    //     }
    //     this.isLoading = false;
    //   },
    //   error => {
    //     this.isError = true;
    //     this.isLoading = false;
    //   }
    // );

    setTimeout(() => {
      this.isLoading = false;
      this.carga.isLogin = true;
      this.router.navigate(['/Principal']);
    }, 2000);
    
  }

}
