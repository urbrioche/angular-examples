import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ColDef, ExcelExportParams, GridApi, GridReadyEvent} from 'ag-grid-community';
import {concatAll, defer, delay, forkJoin, from, map, Observable, Subject, takeUntil, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OlympicWinner} from '../types/olympic.winner';
import {AgHighchartCellComponent} from '../ag-highchart-cell/ag-highchart-cell.component';
import {OlympicChartComponent} from '../olympic-chart/olympic-chart.component';
import {highChartToDataUrl} from '../utils/highcharts-util';
import {RowHeightCallbackParams} from 'ag-grid-community/dist/lib/interfaces/iExcelCreator';

@Component({
  templateUrl: './highchart-in-grid-overview.component.html',
  styleUrls: ['./highchart-in-grid-overview.component.scss']
})
export class HighchartInGridOverviewComponent implements OnInit {

  columnDefs: ColDef[] = [
    {field: 'sport'},
    {
      field: 'base64Image',
      headerName: 'Chart',
      width: 1000,
      cellRenderer: AgHighchartCellComponent
    }
  ];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  rowData$!: Observable<{ sport: string, data: OlympicWinner[] }[]>;
  exportingStatus: ExportingStatus = 'none';
  cancelExporting$: Subject<void> = new Subject<void>();
  defaultExcelExportParams: ExcelExportParams = {
    rowHeight: (params: RowHeightCallbackParams) => params.rowIndex >= 2 ? 400 : 25,
    addImageToCell: (rowIndex, col, value) => {
      if (col.getColId() !== 'base64Image') {
        return;
      }

      return {
        image: {
          id: `${rowIndex}`,
          base64: value,
          imageType: 'png',
          width: 800,
          height: 600,
          position: {
            offsetX: 30,
            offsetY: 5.5,
          },
        },
      };
    },
  };
  exportingProgress: number = 0;
  currentCount = 0;
  private gridApi!: GridApi<GridRowData>;

  constructor(private http: HttpClient, private vcr: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.cancelExporting$.subscribe(() => {
      this.exportingStatus = 'cancel';
      this.exportingProgress = 0;
    });

  }

  onGridReady(params: GridReadyEvent<GridRowData>) {
    this.gridApi = params.api;
    this.rowData$ = this.http
      .get<OlympicWinner[]>('assets/demo-data/olympic-winners.json')
      .pipe(map(data => {
        return [...(data.reduce((accum, cur) => {
          const values = accum.get(cur.sport) || [];
          values.push(cur);
          accum.set(cur.sport, values);
          return accum;
        }, new Map<string, OlympicWinner[]>()))].map(([key, value]): GridRowData => {
          return {sport: key, data: value};
        });
      }));
  }

  export(): void {
    this.exportingStatus = 'processing';
    this.currentCount = 0;
    const data: GridRowData[] = [];
    this.gridApi.forEachNode((x) => {
      const rowData = x.data!;
      data.push(rowData);
    });

    setTimeout(() => {
      this.exportByConcatAll(data);
    }, 0);

    // setTimeout(() => {
    //   this.exportByForkJoin(data);
    // }, 0);
  }

  private exportByForkJoin(data: GridRowData[]) {
    // forJoin的問題是，進度條會hang，前面沒進度，後面跳很快 (js為單一執行緒的關係)
    forkJoin(data.map(row => {
      return defer(() => {
        return this.convertHighchartsToDataUrl(row);
      }).pipe(
        tap(() => {
          console.log("convert by forkJoin");
          this.currentCount++;
          this.exportingProgress = Math.round(this.currentCount / data.length * 100);
        }),
        delay(500),
        map(x => {
          row.base64Image = x;
          return row;
        }));
    })).subscribe(data => {
      if (this.exportingStatus !== 'cancel') {
        console.log('forkJoin done');
        this.gridApi.exportDataAsExcel();
        this.exportingStatus = 'completed';
      }
    });
  }

  private exportByConcatAll(data: GridRowData[]) {
    from(data.map(row => {
      // promise is eager, although no subscribe, still execute highChartToDataUrl promise
      // here use defer to make it lazy executing while subscribe
      return defer(() => {
        return this.convertHighchartsToDataUrl(row);
      }).pipe(
        delay(1),
        tap(() => console.log('converting to base64 image')),
        map(x => {
          row.base64Image = x;
          return row;
        }));
    })).pipe(
      concatAll(),
      takeUntil(this.cancelExporting$),
      tap(() => {
        this.currentCount++;
        this.exportingProgress = Math.round(this.currentCount / data.length * 100);
      })
    ).subscribe({
      next: (data) => {
        console.log('image converted:', data);
      },
      complete: () => {
        console.log('complete');
        if (this.exportingStatus !== 'cancel') {
          this.gridApi.exportDataAsExcel();
          this.exportingStatus = 'completed';
        }
      },
    });
  }

  private convertHighchartsToDataUrl(row: GridRowData) {
    const component = this.vcr.createComponent(OlympicChartComponent);
    const instance = component.instance;
    instance.data = row.data;
    instance.renderTo = document.createElement('div');
    instance.sportName = row.sport;
    instance.createChart();
    const hc = instance.chart;
    return highChartToDataUrl(hc!, {sourceWidth: 800, sourceHeight: 600});
  }

  cancel(): void {
    this.cancelExporting$.next();
  }
}

interface GridRowData {
  sport: string;
  data: OlympicWinner[];
  base64Image?: string;
}

type ExportingStatus = 'none' | 'processing' | 'completed' | 'cancel'

