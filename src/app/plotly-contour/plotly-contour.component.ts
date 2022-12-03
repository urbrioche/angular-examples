import {Component, OnInit} from '@angular/core';
import {Config, Data, Layout} from 'plotly.js-dist-min';
import {HttpClient} from '@angular/common/http';
import {ContourMapData} from '../types/contour-map-data';

@Component({
  templateUrl: './plotly-contour.component.html',
  styleUrls: ['./plotly-contour.component.scss']
})
export class PlotlyContourComponent implements OnInit {
  data!: Data & { contours?: { coloring: string } }[];
  layout!: Partial<Layout>;
  config!: Partial<Config>;

  constructor(private http: HttpClient) {
    this.config = {displayModeBar: false};
  }

  ngOnInit(): void {
    this.http
      .get<ContourMapData>('assets/demo-data/contour-map-data.json')
      .subscribe(data => {
        // https://plotly.com/javascript/contour-plots/
        this.data = [{
          x: data.gridData.x,
          y: data.gridData.y,
          z: data.gridData.z,
          type: 'contour',
          connectgaps: false,
          colorscale: 'Jet',
          contours: {
            coloring: 'heatmap',
          }
        }];

        this.layout = {
          xaxis: {visible: false},
          yaxis: {visible: false},
          shapes: [{
            type: 'circle',
            xref: 'x',
            yref: 'y',
            x0: -150,
            y0: -150,
            x1: 150,
            y1: 150,
            //opacity: 1,
            //fillcolor: null,
            line: {
              color: 'black'
            }
          }],
        };
      });
  }

}
