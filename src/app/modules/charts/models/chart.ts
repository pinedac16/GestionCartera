import { Input } from '@angular/core';

export class Chart {

  /**
   * chart outer container width
   */
  @Input() width = 800;
  /**
   * chart outer container height
   */
  @Input() height = 600;
  /**
   * distance from outer container to inner container (plot area) in all directions
   */
  @Input() margin = 60;
  /**
   * The data to visualize
   */
  @Input() data: any[];
  /**
   * The svg graph
   */
  protected svg: any;
  /**
   * The main g element (outer container)
   */
  protected chart: any;
  /**
   * Chart inner container (plot area) width
   */
  protected chartWidth: number;
  /**
   * Chart inner container (plot area) height
   */
  protected chartHeight: number;

  /**
   * Calculate the size of the inner container (plot area)
   */
  protected calculatePlotSize() {
    this.chartWidth = this.width - 2 * this.margin;
    this.chartHeight = this.height - 2 * this.margin;
  }

}
