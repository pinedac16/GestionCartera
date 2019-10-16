import { Input } from '@angular/core';
import { Chart } from './chart';

import { scaleBand, scaleLinear, axisLeft, axisBottom } from 'd3';
import { TEXT_ANCHOR, MIDDLE } from '../consts/consts';

export class BarChart extends Chart {

  @Input() xLabel: string;
  @Input() yLabel: string;
  @Input() title: string;

  /**
   * yOffset controls the domain of the y axis. If true, the y axis will not begin at 0,
   * but at the min data value +/- 20% of the range. Default value is false.
   */
  @Input() yOffset = false;
  /**
   * The distance between the bars. Default value is 0.4
   */
  @Input() padding = 0.4;

  protected xScale: any;
  protected yScale: any;
  protected xAxis: any;
  protected yAxis: any;

  /**
   * Generates the vertical and horizontal scales
   * @param yLimits the min and max y values
   */
  protected generateScales(yLimits: { min: number, max: number }) {
    // scales
    this.xScale = scaleBand()
      .range([0, this.chartWidth])
      .domain(this.data.map((d) => d.label))
      .padding(this.padding);

    this.yScale = scaleLinear()
      .range([this.chartHeight, 0])
      .domain([yLimits.min, yLimits.max]);
  }

  /**
   * Add vertical and horizontal axes to the chart. Additionally the grid is also added.
   */
  protected addAxes() {
    // grid
    const makeYLines = () => axisLeft(this.yScale);

    this.xAxis = this.chart.append('g')
      .attr('class', 'x d3-axis')
      .attr('transform', `translate(0, ${this.chartHeight})`)
      .call(axisBottom(this.xScale));

    // Add fake bottom line
    this.xAxis.append('line')
      .attr('class', 'bottom-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.chartWidth)
      .attr('y2', 0);

    this.yAxis = this.chart.append('g')
      .attr('class', 'y d3-axis')
      .call(axisLeft(this.yScale));

    this.chart.append('g')
      .attr('class', 'd3-grid')
      .call(makeYLines()
        .tickSize(-this.chartWidth)
        .tickFormat('' as any)
      );
  }

  /**
   * Add y, x labels and the chart title
   */
  protected addLabels() {
    this.svg.append('text')
      .attr('x', -(this.chartHeight / 2) - this.margin)
      .attr('y', this.margin / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr(TEXT_ANCHOR, MIDDLE)
      .text(this.yLabel);

    this.svg.append('text')
      .attr('x', this.chartWidth / 2 + this.margin)
      .attr('y', this.chartHeight + this.margin * 1.7)
      .attr(TEXT_ANCHOR, MIDDLE)
      .text(this.xLabel);

    this.svg.append('text')
      .attr('class', 'd3-title')
      .attr('x', this.margin)
      .attr('y', this.margin / 2)
      .text(this.title);
  }

}
