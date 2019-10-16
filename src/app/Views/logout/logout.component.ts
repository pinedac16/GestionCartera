import { Component, OnInit } from '@angular/core';
import { CargaService } from '../../Services/Carga/carga.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private carga: CargaService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.carga.isLogin = false;
  }

  home() {
    this.router.navigate(['/Login']);

  }

}
