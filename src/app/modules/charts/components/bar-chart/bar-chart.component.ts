import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { select, max, min, format } from 'd3';

import { BarChart } from '../../models/bar-chart';
import { tooltipPath } from '../../shapes/shapes';
import { TEXT_ANCHOR, MIDDLE, BLUE, BLUE_LIGHTENED, DURATION } from '../../consts/consts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent extends BarChart implements OnInit {

  @ViewChild('chart') private readonly chartContainer: ElementRef;

  private statsTooltip: any;
  /**
   * The index of the selected (clicked) bar
   */
  private selectedBar: number;

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

    const yLimits = this.calculateMaxAndMinValue();

    // generate horizontal and vertical scales
    this.generateScales(yLimits);

    // axes and grid
    this.addAxes();

    this.chart.selectAll()
      .data(this.data)
      .enter()
      .append('rect')
      .attr('fill', BLUE)
      .attr('x', (s) => this.xScale(s.label))
      .attr('y', (s) => this.yScale(s.value))
      .attr('height', (s) => this.chartHeight - this.yScale(s.value))
      .attr('width', this.xScale.bandwidth())
      .on('mouseenter', (d, i, n) => {
        const rect = select(n[i]);
        if (i !== 0) {
          rect.style('cursor', 'pointer');
        }
        rect.transition()
          .duration(DURATION)
          .attr('fill', BLUE_LIGHTENED);
        // Horizontal line
        const y = this.yScale(d.value);
        const circleRadius = 5;
        const limitGroup = this.chart.append('g')
          .attr('id', 'limit-group');
        // line
        limitGroup.append('line')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', this.chartWidth)
          .attr('y2', y);
        // circle
        limitGroup.append('circle')
          .attr('id', 'circle')
          .attr('cx', this.chartWidth)
          .attr('cy', y)
          .attr('r', circleRadius);
        // value
        limitGroup.append('text')
          .attr('x', this.chartWidth)
          .attr('y', y - (2 * circleRadius))
          .attr(TEXT_ANCHOR, MIDDLE)
          .text(format(',.0f')(d.value));
      })
      .on('mouseleave', (d, i, n) => {
        const rect = select(n[i]);
        if (i !== 0) {
          rect.style('cursor', 'default');
        }
        rect.transition()
          .duration(DURATION)
          .attr('fill', BLUE);
        this.chart.select('#limit-group').remove();
      })
      .on('click', this.onClickHandler);

    this.addLabels();

    this.addStatsTooltip(this.chart);
  }

  private calculateMaxAndMinValue(): { min: number, max: number } {
    let yMinValue: number;
    let yMaxValue: number;
    if (this.yOffset) {
      const minValue = min(this.data, d => d.value);
      const maxValue = max(this.data, d => d.value);
      const padding = (maxValue - minValue) * 0.2;
      yMinValue = minValue > padding ? minValue - padding : 0;
      yMaxValue = maxValue + padding;
    } else {
      yMinValue = 0;
      yMaxValue = max(this.data, d => d.value);
    }
    return { min: yMinValue, max: yMaxValue };
  }

  private readonly onClickHandler = (d, i) => {
    if (i !== 0) {
      if (this.selectedBar === i) {
        this.selectedBar = -1;
        this.statsTooltip.style('display', 'none');
      } else {
        this.selectedBar = i;
        const increasePerc = ((this.data[i].value * 100) / this.data[i - 1].value) - 100;
        this.statsTooltip
          .attr('transform', () => {
            const xPos = this.xScale(d.label) + (this.xScale.bandwidth() / 2);
            const yPos = this.yScale(d.value) - 10;
            return `translate(${xPos}, ${yPos})`;
          })
          .style('display', null);
        this.statsTooltip.select('text').text(`${format('+,.1f')(increasePerc)}%`);
      }
    }
  }

  private addStatsTooltip(selection: any) {
    const width = 70, height = 20, offset = 7, radius = 5;
    // Prep the tooltip bits, initial display is hidden
    this.statsTooltip = selection.append('g')
      .attr('class', 'd3-tooltip')
      .style('display', 'none');

    this.statsTooltip.append('path')
      .attr('d', tooltipPath(width, height, offset, radius, 'top'));

    this.statsTooltip.append('text')
      .attr('x', 0)
      .attr('y', -offset - (height / 2))
      .attr(TEXT_ANCHOR, MIDDLE);

    this.selectedBar = -1;
  }

}

export interface BarChartDatum {
  label: string;
  value: number;
}
