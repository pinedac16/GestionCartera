import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAreaComponent } from './chart-area.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { TypeCharts } from './charts-area.interface';

describe('ChartAreaComponent', () => {
  let component: ChartAreaComponent;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Ng2GoogleChartsModule],
      providers: [
        ChartAreaComponent
      ]
    })
      .compileComponents();
    component = TestBed.get(ChartAreaComponent)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ngOninit', () => {
    component.chartOptions = {
      legend: true,
      chartArea: {
        left: '10%',
        width: '90%'
      }
    };

    component.dataOptions = {};
    component.data = [
      ['', 'May', 'April', 'June'],
      ['svp', 10, 15, 20],
      ['someone', 100, 15, 4]
    ];
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should type = PieChart', () => {
    component.chartOptions = {
      legend: true,
      chartArea: {
        left: '10%',
        width: '90%'
      }
    };

    component.dataOptions = {};
    component.data = [
      ['', 'May', 'April', 'June'],
      ['svp', 10, 15, 20],
      ['someone', 100, 15, 4]
    ];

    component.type = TypeCharts.LINECHART
    component.ngOnInit();
    expect(component).toBeTruthy();
    component.type = TypeCharts.DONUTCHART
    component.ngOnInit();
    expect(component).toBeTruthy();
    component.type = TypeCharts.COLUMNCHART
    component.ngOnInit();
    expect(component).toBeTruthy();

    component.type = 0 as any;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should showError', () => {
    component.type = 0 as any;
    component.error({ detailedMessage: '', message: '', options: '' } as any);
    expect(component).toBeTruthy();
  });

  it('should sizeWindow', () => {
    component.type = 0 as any;
    component.sizeWindow({ target: { innerWidth: 800 } } as any);
    expect(component).toBeTruthy();
  });


});
