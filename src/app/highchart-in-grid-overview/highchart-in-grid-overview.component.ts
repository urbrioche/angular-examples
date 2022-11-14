import {Component, OnInit} from '@angular/core';
import {ColDef} from 'ag-grid-community';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OlympicWinner} from '../types/olympic.winner';
import {AgHighchartCellComponent} from '../ag-highchart-cell/ag-highchart-cell.component';

@Component({
  templateUrl: './highchart-in-grid-overview.component.html',
  styleUrls: ['./highchart-in-grid-overview.component.scss']
})
export class HighchartInGridOverviewComponent implements OnInit {

  public columnDefs: ColDef[] = [
    {field: 'sport'},
    {
      field: '',
      headerName: 'Chart',
      width: 1000,
      cellRenderer: AgHighchartCellComponent
    }
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: Observable<{ sport: string, data: OlympicWinner[] }[]>;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onGridReady() {
    this.rowData$ = this.http
      .get<OlympicWinner[]>('assets/demo-data/olympic-winners.json')
      .pipe(map(data => {
        return [...(data.reduce((accum, cur) => {
          const values = accum.get(cur.sport) || [];
          values.push(cur);
          accum.set(cur.sport, values);
          return accum;
        }, new Map<string, OlympicWinner[]>()))].map(([key, value]) => {
          return {sport: key, data: value};
        });
      }));
  }
}

