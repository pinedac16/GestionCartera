import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PrincipalComponent } from './Views/Principal/principal.component';

import { DataTablesModule } from 'angular-datatables';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { enableProdMode } from '@angular/core';
import { Globals } from '../globals';
import { GrowlModule } from 'primeng/growl';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenubarModule } from 'primeng/menubar';
import { Constantes } from './Models/Constantes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CargaComponent } from './Views/Carga/carga.component';
import { CitasComponent } from './Views/Citas/citas.component';
import { ReportesComponent } from './Views/Reportes/reportes.component';
import { InformesComponent } from './Views/Informes/informes.component';
import { ChartsModule } from './modules/charts/charts.module';
import { ProcesoJuridicoComponent } from './Views/ProcesoJuridico/proceso-juridico.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.url_i18n, '.resx');
}

//Instanciar todas las depencias y librerías utilizadas en el programa

enableProdMode();

const routes: Routes = [
  {
    path: 'Principal',
    component: PrincipalComponent
  },
  {
    path: 'Carga',
    component: CargaComponent
  },
  {
    path: 'Citas',
    component: CitasComponent
  },
  {
    path: 'Reportes',
    component: ReportesComponent
  },
  {
    path: 'Informes',
    component: InformesComponent
  },
  {
    path: 'Procesos',
    component: ProcesoJuridicoComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    CargaComponent,
    CitasComponent,
    ReportesComponent,
    InformesComponent,
    ProcesoJuridicoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DataTablesModule,
    FileUploadModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    GrowlModule,
    TooltipModule,
    ProgressSpinnerModule,
    MenubarModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [Globals, Constantes, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
