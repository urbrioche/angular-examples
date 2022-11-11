import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ColDef, GridReadyEvent} from 'ag-grid-community';
import {HttpClient} from '@angular/common/http';
import MyCellParams, {MyCellComponent} from '../my-cell/my-cell.component';
import {ICellRendererParams} from 'ag-grid-community/dist/lib/rendering/cellRenderers/iCellRenderer';
import {UnderComponent} from '../under/under.component';
import {OverComponent} from '../over/over.component';

@Component({
  templateUrl: './enterprise-overview.component.html',
  styleUrls: ['./enterprise-overview.component.scss']
})
export class EnterpriseOverviewComponent implements OnInit {
  public columnDefs: ColDef[] = [
    {
      field: 'athlete', cellRenderer: MyCellComponent, cellRendererParams: {
        buttonText: 'Name'
      } as MyCellParams
    },
    {
      field: 'age', cellRendererSelector: (params: ICellRendererParams) => {
        return {
          component: params.value < 25 ? UnderComponent : OverComponent
        };
      }
    },
    {field: 'country'},
    {field: 'year'},
    {field: 'date'},
    {field: 'sport'},
    {field: 'gold'},
    {field: 'silver'},
    {field: 'bronze'},
    {field: 'total'},
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    // this is enterprise feature
    enableRowGroup: true
  };

  public rowData$!: Observable<OlympicWinner[]>;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.rowData$ = this.http
      .get<OlympicWinner[]>('assets/demo-data/olympic-winners.json');
  }
}

interface OlympicWinner {
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}
