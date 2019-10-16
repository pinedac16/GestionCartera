import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.data = [
      { value: 680000, label: 'Enero'},
      { value: 713000.45, label: 'Febrero'},
      { value: 800000, label: 'Marzo'}
    ];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set limits for yOffset = true', () => {
    component.data = [
      { value: 680000, label: 'Enero'},
      { value: 713000.45, label: 'Febrero'},
      { value: 800000, label: 'Marzo'}
    ];
    component.yOffset = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
