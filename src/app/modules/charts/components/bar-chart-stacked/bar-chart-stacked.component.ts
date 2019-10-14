import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { select, mouse, max, min, stack, format } from 'd3';

import { BarChart } from '../../models/bar-chart';
import { tooltipPath } from '../../shapes/shapes';
import { TEXT_ANCHOR, MIDDLE, BLUE, BLUE_LIGHTENED, RED, RED_LIGHTENED, DURATION } from '../../consts/consts';

@Component({
  selector: 'app-bar-chart-stacked',
  templateUrl: './bar-chart-stacked.component.html',
  styleUrls: ['./bar-chart-stacked.component.scss'],
  encapsulation: ViewEncapsulation.None
})
/**
 * DualStackedBar chart. It asummens data[0] it always bigger than data[1]
 */
export class BarChartStackedComponent extends BarChart implements OnInit {

  @ViewChild('chart') private readonly chartContainer: ElementRef;

  @Input() legend: string[];

  private tooltip: any;

  private keys: string[];

  ngOnInit() {
    this.calculatePlotSize();
    this.createChartContainer();
    this.createChart();
  }

  private createChartContainer() {
    // chart container
    const element = this.chartContainer.nativeElement;
    this.svg = select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'd3-chart')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
  }

  private createChart() {

    this.keys = Object.keys(this.data[0]).filter(k => k !== 'label');
    const series = stack().keys(this.keys)(this.data);

    const yLimits = this.calculateMaxAndMinValue();

    this.generateScales(yLimits);

    this.addAxes();

    this.chart.selectAll('.serie')
      .data(series)
      .enter()
      .append('g')
        .attr('class', 'serie')
      .selectAll('rect')
      .data((serie: any) => {
        serie.forEach(serieItem => serieItem.key = serie.key);
        return serie;
      })
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('fill', (d) => {
          const keyIndex = this.keys.findIndex(key => key === d.key);
          return keyIndex === 0 ? BLUE : RED;
        })
        .attr('x', (d) => this.xScale(d.data.label))
        .attr('y', (d) => this.yScale(d[1]))
        .attr('height', (d) => {
          const value = d[1] - d[0];
          if (value > yLimits.min) {
            return this.chartHeight - this.yScale(d[1] - d[0]);
          } else {
            return this.yScale(d[0]) - this.yScale(d[1]);
          }
        })
        .attr('width', this.xScale.bandwidth())
        .on('mouseover', (d, i, n) => {
          this.tooltip.style('display', null);
          select(n[i]).transition()
            .duration(DURATION)
            .attr('fill', () => {
              const keyIndex = this.keys.findIndex(key => key === d.key);
              return keyIndex === 0 ? BLUE_LIGHTENED : RED_LIGHTENED;
            });
        })
        .on('mouseout', (d, i, n) => {
          this.tooltip.style('display', 'none');
          select(n[i]).transition()
            .duration(DURATION)
            .attr('fill', () => {
              const keyIndex = this.keys.findIndex(key => key === d.key);
              return keyIndex === 0 ? BLUE : RED;
            });
        })
        .on('mousemove', (d, i, n) => {
          const xPosition = mouse(n[i])[0];
          const yPosition = mouse(n[i])[1] - 10;
          this.tooltip.attr('transform', `translate(${xPosition}, ${yPosition})`);
          this.tooltip.select('text').text(format(',.0f')(d[1] - d[0]));
        });

    this.addLabels();

    this.addLegend(this.svg);

    this.addTooltip(this.chart);
  }

  private calculateMaxAndMinValue(): { min: number, max: number } {
    const stackSums = [];
    this.data.forEach(barsStack => {
      let stackSum = 0;
      this.keys.forEach(k => {
        stackSum += barsStack[k];
      });
      stackSums.push(stackSum);
    });

    let yMinValue: number;
    let yMaxValue: number;
    if (this.yOffset) {
      const minValue = min(this.data, d => d[this.keys[0]]);
      const maxValue = max(stackSums);
      const padding = (maxValue - minValue) * 0.2;
      yMinValue = minValue > padding ? minValue - padding : 0;
      yMaxValue = maxValue + padding;
    } else {
      yMinValue = 0;
      yMaxValue = max(stackSums);
    }
    return { min: yMinValue, max: yMaxValue };
  }

  private addLegend(selection: any) {
    const circleRadius = 5;
    const labelsSep = 70;

    const keys = this.legend ? this.legend : this.keys;

    const legendGroup = selection.append('g')
      .attr('class', 'd3-legend')
      .attr('transform', `translate(${this.margin + this.chartWidth - 120}, -10)`);

    legendGroup.append('text')
      .attr('x', 2 * circleRadius)
      .attr('y', 40)
      .text(keys[0]);

    legendGroup.append('circle')
      .attr('class', 'primary')
      .attr('cx', 0)
      .attr('cy', 36)
      .attr('r', circleRadius);

    legendGroup.append('text')
      .attr('x', labelsSep + (2 * circleRadius))
      .attr('y', 40)
      .text(keys[1]);

    legendGroup.append('circle')
      .attr('class', 'secondary')
      .attr('cx', labelsSep)
      .attr('cy', 36)
      .attr('r', circleRadius);
  }

  private addTooltip(selection: any) {
    const width = 70, height = 20, offset = 7, radius = 5;
    // Prep the tooltip bits, initial display is hidden
    this.tooltip = selection.append('g')
      .attr('class', 'd3-tooltip-group')
      .style('display', 'none');

    this.tooltip.append('path')
    .attr('d', tooltipPath(width, height, offset, radius, 'top'));

    this.tooltip.append('text')
    .attr('x', 0)
    .attr('y', -offset - (height / 2))
    .attr(TEXT_ANCHOR, MIDDLE);
  }

}
