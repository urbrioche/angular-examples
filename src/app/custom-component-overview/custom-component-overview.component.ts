import {Component, OnInit} from '@angular/core';
import {ColDef, GridReadyEvent} from 'ag-grid-community';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyCustomComponent} from '../my-custom/my-custom.component';

@Component({
  templateUrl: './custom-component-overview.component.html',
  styleUrls: ['./custom-component-overview.component.scss']
})
export class CustomComponentOverviewComponent implements OnInit {
  public columnDefs: ColDef[] = [
    {field: 'athlete'},
    {field: 'age'},
    {
      field: 'country',
      filter: MyCustomComponent,
      filterParams: {
        name: "Filter"
      }
    },
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
