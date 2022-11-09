import {Component, OnInit, ViewChild} from '@angular/core';
import {CellClickedEvent, ColDef} from 'ag-grid-community';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AgGridAngular} from 'ag-grid-angular';

@Component({
  templateUrl: './quickstart-guide.component.html',
  styleUrls: ['./quickstart-guide.component.scss']
})
export class QuickstartGuideComponent implements OnInit {
  public colDefs: ColDef[] = [
    { field: 'make'},
    { field: 'model'},
    { field: 'price' }
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  public rowData$!: Observable<Car[]>;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.rowData$ = this.http
      .get<Car[]>('assets/demo-data/row-data.json');
  }

  onCellClicked(event: CellClickedEvent) {
    console.log(event);
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }
}

interface Car {
  make: string;
  model: string;
  price: number;
}
