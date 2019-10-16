import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoJuridicoComponent } from './proceso-juridico.component';

describe('ProcesoJuridicoComponent', () => {
  let component: ProcesoJuridicoComponent;
  let fixture: ComponentFixture<ProcesoJuridicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoJuridicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoJuridicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
