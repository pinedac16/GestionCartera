import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TypeCharts} from './charts-area.interface';
import {DomSanitizer} from '@angular/platform-browser';
import {ChartErrorEvent} from 'ng2-google-charts';

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent implements OnInit {

  @Input() chartOptions: any = {};
  @Input() data: Array<any>;
  @Input() dataOptions: any = {};
  @Input() type: TypeCharts;
  @ViewChild('gchart') chart;
  @Output() chartReady = new EventEmitter<any>();


  private readonly MEDIA_QUERY_MOBILE = 767;
  mobile: boolean;

  private readonly COMMON_CHART_OPTIONS = {
    backgroundColor: {
      fill: 'transparent',
      stroke: 'transparent'
    },
    chartArea: {
      backgroundColor: {
        fill: 'transparent',
        stroke: 'transparent'
      },
      width: '80%'
    },
    colors: ['rgb(232,193,31)', 'rgb(84,84,84)', '#004b98', '#ec1b2e'],
    fontName: '\'Open Sans\', sans-serif',
    fontSize: '12',
    legend: 'none',
    title: ''
  };
  private readonly TEMPORARY_COLOR_BASELINE_LINE_CHART: string = '#ffffff';
  legends: Array<any> = [];
  chartDataAndOptions: any = {};
  private chartConfigOptions: any = {};
  private maxChartDateValue: any = null;
  private maxChartValue = 0;
  private minChartDateValue: any = null;
  private minChartValue = 0;
  private empty = 0;
  private COLUMNCHART_TYPE = 'ColumnChart';
  private DONUTCHART_TYPE = 'PieChart';
  private LINECHART_TYPE = 'LineChart';

  constructor(private sanitizer: DomSanitizer) {
    this.mobile = window.innerWidth > this.MEDIA_QUERY_MOBILE ? false : true;
  }

  ngOnInit() {
    if (this.type !== TypeCharts.DONUTCHART) {
      this.setDataLineBarCharts();
    }
    this.configChart();
    this.setGraphic();
  }

  public error(event: ChartErrorEvent) {
    console.log(event.message);
    console.log(event.detailedMessage);
    console.log(event.options);
    console.log(event);
  }


  @HostListener('window:resize', ['$event'])
  sizeWindow(event: any) {
    this.mobile = event.target.innerWidth > this.MEDIA_QUERY_MOBILE ? false : true;
  }

  private configChart(): void {
    // Default charts configuration
    for (const option in this.COMMON_CHART_OPTIONS) {
      this.chartConfigOptions[option] = this.COMMON_CHART_OPTIONS[option];
    }

    for (const option in this.chartOptions) {
      if ('legend' !== option) {
        this.chartConfigOptions[option] = this.chartOptions[option];
      }
    }
    for (const option in this.dataOptions) {
      this.chartConfigOptions[option] = this.dataOptions[option];
    }
  }


  private setDataLineBarCharts(): void {
    const data: Array<Array<any>> = new Array<Array<any>>();
    const max = (list: Array<any>): number => {
      let _max = -1;
      try {
        _max = Math.max.apply(null, list.slice(1, list.length));
      } catch (e) {
        console.log(e);
      }
      return _max;
    };
    const min = (list: Array<any>): number => {
      let _min = 9999999999999999999999999999;
      try {
        _min = Math.max.apply(null, list.slice(1, list.length));
      } catch (e) {
        console.log(e);
      }
      return _min;
    };
    // Add labels
    data.push(this.data.map((row: Array<any>): string => {
      return row[0];
    }));
    // Add legends if necessary
    this.configLegend(data[0]);
    // Extract min and max date
    this.data[0].forEach((date: any, index: number) => {
      if (index > 0) {
        this.minChartDateValue = this.minChartDateValue && this.minChartDateValue < date ?
          this.minChartDateValue : date;
        this.maxChartDateValue = this.maxChartDateValue && this.maxChartDateValue > date ?
          this.maxChartDateValue : date;
      }
    });
    // Map data to rows
    for (let index = 1; index < this.data[0].length; index++) {
      // Extract min a max values
      this.minChartValue = this.minChartValue && this.minChartValue < min(this.data[index]) ? this.minChartValue : min(this.data[index]);
      this.maxChartValue = this.maxChartValue && this.maxChartValue > max(this.data[index]) ? this.maxChartValue : max(this.data[index]);
      // map values to new rows
      data.push(this.data.map((row: Array<number>) => {
        return row[index];
      }));
    }
    this.data = data;
  }

  private setGraphic(): void {
    try {
      this.chartDataAndOptions = {
        chartType: this.getType(),
        dataTable: this.data,
        options: this.chartConfigOptions
      };

    } catch (e) {
      throw new Error(e);
    }
  }

  private configLegend(rows: Array<string>): void {
    const getColor: any = (index: number): any => {
      if (index < this.COMMON_CHART_OPTIONS.colors.length) {
        return this.sanitizer.bypassSecurityTrustStyle(this.COMMON_CHART_OPTIONS.colors[index]);
      }
      return this.sanitizer.bypassSecurityTrustStyle(this.COMMON_CHART_OPTIONS.colors[this.COMMON_CHART_OPTIONS.colors.length - 1]);
    };
    if (this.chartOptions && this.chartOptions['legend'] && this.chartOptions['legend'] === true) {
      let count = 0;

      rows.forEach((row: string, index) => {
        if (row !== '0' && index !== 0) {
          this.legends.push({
            color: getColor(count++),
            label: row
          });
        }
      });
    }
  }

  private getType(): string {
    switch (this.type) {
      case TypeCharts.COLUMNCHART:
        return this.COLUMNCHART_TYPE;
      case TypeCharts.DONUTCHART:
        return this.DONUTCHART_TYPE;
      case TypeCharts.LINECHART:
        return this.LINECHART_TYPE;
      default:
        return this.COLUMNCHART_TYPE;
    }
  }

}
