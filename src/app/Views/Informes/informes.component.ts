import { Component, OnInit } from '@angular/core';
import { CargaService } from '../../Services/Carga/carga.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  constructor(
    private router: Router,
    private carga: CargaService
  ) { }

  ngOnInit() {
    if (!this.carga.isLogin) {
      this.router.navigate(['/Login']);
    }
  }

}
