import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import * as _ from 'lodash';
import {OlympicWinner} from '../types/olympic.winner';
import {copyChartToClipboard} from '../utils/highcharts-util';

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
        menuItemDefinitions: {
          copyToClipboard: {
            onclick: function () {
              copyChartToClipboard(this).then().catch(e => console.error(e));
            },
            text: 'Copy to clipboard'
          },
        },
        buttons: {
          contextButton: {
            menuItems: ['copyToClipboard']
          }
        }
      },
      series: series,
    };

    Highcharts.chart(this.ele.nativeElement, options);
  }
}
