import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import * as _ from 'lodash';
import {OlympicWinner} from '../types/olympic.winner';

HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);

@Component({
  selector: 'app-olympic-chart',
  templateUrl: './olympic-chart.component.html',
  styleUrls: ['./olympic-chart.component.scss']
})
export class OlympicChartComponent implements OnInit, OnChanges {

  @Input()
  data?: OlympicWinner[];
  @Input()
  sportName?: string;

  constructor(private ele: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.createChart();
    }
  }

  ngOnInit(): void {
  }

  createChart() {
    if (!this.data) {
      return;
    }
    const years = _.chain(this.data).map(x => x.year.toString()).orderBy().uniq().value();
    const series = _.chain(this.data).groupBy(x => x.country).entries().map(([country, value]) => {
      const dataMap = new Map<string, number>(
        _.chain(value).groupBy(x => x.year).entries()
          .map(([year, val]) => [year, _.sum(val.map(m => m.total))] as const).value()
      );
      const metals = years.map(year => dataMap.get(`${year}`) || 0);
      return {
        name: country,
        type: 'column',
        data: metals,
      } as Highcharts.SeriesColumnOptions;
    }).value();

    const options: Highcharts.Options = {
      chart: {
        type: 'column',
        borderWidth: 1,
        style: {fontFamily: 'Arial'}
      },
      title: {
        text: `${this.sportName}`
      },
      xAxis: {
        categories: years
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title?.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend?.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
        enabled: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      exporting: {
        // menuItem
        //   // Custom definition
        //   adjustYAxis: {
        //     onclick: () => {
        //       showModal().then(x => {
        //         const obj = x as { [key: string]: number };
        //         chartRef.current?.yAxis[0].setExtremes(obj['min'], obj['max']);
        //       });
        //     },
        //     text: 'Adjust Y-Axis'
        //   },
        //   toggleLegend: {
        //     onclick: function () {
        //       this.legend.update({enabled: !this.legend.options.enabled});
        //     },
        //     text: 'Show/Hide Legend'
        //   },
        // },
        // buttons: {
        //   contextButton: {
        //     menuItems: ['toggleLegend', 'adjustYAxis']
        //   }
        // }
      },
      series: series,
    };

    Highcharts.chart(this.ele.nativeElement, options);
  }
}
