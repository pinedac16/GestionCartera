import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { Globals } from '../globals';
import { format } from 'util';
import { Message, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Calculos';
  msgs: Message[] = [];
  items: MenuItem[];

  constructor(private translate: TranslateService, 
              private router: Router, 
              private globals: Globals) {

    //Se setena los lenguajes y el lenguaje por defecto [es]
    translate.langs = ['es', 'en', 'pt'];
    translate.setDefaultLang('es');
    this.translate.currentLang = 'es';

    this.getInfoPpal();

    //Metodo para rutear los componentes
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }

  //Metodo para el Switch de los lenguales a seleccionar y traducir la página
  switchLanguage(language: string) {
    if (this.translate.currentLang != language) {
      this.showLoading("Cambiando Lenguaje");
      this.translate.use(language);
      this.translate.currentLang = language;

      this.getTraducsPpal();

      this.getMenu();
      this.router.navigate([this.router.url]);
      this.hideLoading();
    }
  }

  //Al inicio del programa, se coloca un estilo a los botones de los idiomas y se carga el menú
  public ngOnInit() {
    $(document).ready(function () {
      $('.btn-circle').click(function () {
        $('.btn-circle').css('opacity', '0.4');
        $(this).css('opacity', '1');
      });
    });

    this.items = [
      {
        label: 'Inicio',
        routerLink: '/Principal',
      }
    ];
  }

  //Metodó para traer las traducciones
  getInfoPpal(): void {

    this.getMenu();
    this.translate.get('General_Cargando_Info_Ppal').subscribe(msg => {
      this.showLoading(msg);
      this.getTraducsPpal();
      this.hideLoading();
      this.router.navigate(['/Principal']);
    });

  }

  //Metodo para traer los items del menú
  getMenu(): void{
    this.translate.get('Menu_Inicio').subscribe(msg => {
        this.items = [
          { label: msg, routerLink: '/Principal'},
          { label: this.translate.instant('Menu_Carga'), routerLink: '/Carga' },
          { label: this.translate.instant('Menu_Reportes'), routerLink: '/Reportes' },
          { label: this.translate.instant('Menu_Citas'), routerLink: '/Citas' }
        ];
    });
  }

  //Traer las traducciones principales
  getTraducsPpal(): void {
    this.translate.get('General_Titulo_Success').subscribe(msg => {
      this.globals.TituloMsgSuccess = msg;
    });
  }

  //Metodo para los mensajes de errores generales
  msgError(error): void {
    this.msgs = [];
    var msg = format(this.globals.MsgError, error);
    this.msgs.push({ severity: 'error', summary: this.globals.TituloMsgError, detail: msg });
  }

  //Mostar cargando en la página
  showLoading(msg): void {
    $('#Loading').find('.loaderText').find('h4').html(msg);
    $('#Loading').fadeIn();
  }

  //Esconder cargando en la página
  hideLoading(): void {
    $('#Loading').find('.loaderText').find('h4').html('');
    $('#Loading').fadeOut();
  }

}
