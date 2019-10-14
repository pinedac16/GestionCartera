import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartStackedComponent } from './bar-chart-stacked.component';

describe('BarChartStackedComponent', () => {
  let component: BarChartStackedComponent;
  let fixture: ComponentFixture<BarChartStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartStackedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.data = [
      { label: 'Enero', A: 1000, B: 20},
      { label: 'Febrero', A: 800, B: 50},
      { label: 'Marzo', A: 600, B: 30 }
    ];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set limits for yOffset = true', () => {
    component.data = [
      { label: 'Enero', A: 1000, B: 20},
      { label: 'Febrero', A: 800, B: 50},
      { label: 'Marzo', A: 600, B: 30 }
    ];
    component.yOffset = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
