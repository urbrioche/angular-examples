import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ColDef, ExcelExportParams, GridApi, GridReadyEvent} from 'ag-grid-community';
import {forkJoin, from, map, mergeMap, Observable, of} from 'rxjs';
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

  public columnDefs: ColDef[] = [
    {field: 'sport'},
    {
      field: 'chart',
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
  private gridApi!: GridApi<GridRowData>;
  private params!: GridReadyEvent<OlympicWinner>;
  defaultExcelExportParams: ExcelExportParams = {
    rowHeight: (params: RowHeightCallbackParams) => params.rowIndex >= 2 ? 400 : 25,
    addImageToCell: (rowIndex, col, value) => {
      console.log(rowIndex, col);
      if (col.getColId() !== 'chart') {
        return;
      }


      console.log(rowIndex, this.gridApi.getModel().getRow(rowIndex)?.data);
      const img = this.gridApi.getModel().getRow(rowIndex - 2)?.data?.base64Image;
      // console.log(img);
      return {
        image: {
          id: this.gridApi.getModel().getRow(rowIndex - 2)?.data?.sport,
          base64: img,
          imageType: 'png',
          width: 600,
          height: 400,
          position: {
            offsetX: 30,
            offsetY: 5.5,
          },
        },
      };
    },
  };

  constructor(private http: HttpClient, private vcr: ViewContainerRef) {
  }

  ngOnInit(): void {
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
    const data: GridRowData[] = [];
    this.gridApi.forEachNode(async (x) => {
      const rowData = x.data!;
      // const component = this.vcr.createComponent(OlympicChartComponent);
      // component.instance.data = rowData.data;
      // component.instance.renderTo = document.createElement('div');
      // component.instance.sportName = rowData.sport;
      // component.instance.createChart();
      // const hc = component.instance.chart;
      // const base64Img = await highChartToDataUrl(hc!);
      // rowData.base64Image = base64Img;
      data.push(rowData);
    });

    forkJoin(data.map(row => {
      const component = this.vcr.createComponent(OlympicChartComponent);
      component.instance.data = row.data;
      component.instance.renderTo = document.createElement('div');
      component.instance.sportName = row.sport;
      component.instance.createChart();
      const hc = component.instance.chart;
      return from(highChartToDataUrl(hc!)).pipe(map(x => {
        row.base64Image = x;
        return row;
      }));
    })).subscribe(data => {
      // console.log(data);
      this.gridApi.exportDataAsExcel();
    });
    // from(data.map(row => row)).pipe(
    //   mergeMap(row => {
    //     const component = this.vcr.createComponent(OlympicChartComponent);
    //     component.instance.data = row.data;
    //     component.instance.renderTo = document.createElement('div');
    //     component.instance.sportName = row.sport;
    //     component.instance.createChart();
    //     const hc = component.instance.chart;
    //     return from(highChartToDataUrl(hc!));
    //   })
    // from(data.map(row => row)).pipe(
    //   mergeMap(row => {
    //     const component = this.vcr.createComponent(OlympicChartComponent);
    //     component.instance.data = row.data;
    //     component.instance.renderTo = document.createElement('div');
    //     component.instance.sportName = row.sport;
    //     component.instance.createChart();
    //     const hc = component.instance.chart;
    //     return from(highChartToDataUrl(hc!));
    //   })
    // ).subscribe(x => console.log(x));

    // of(Promise.all(data.map(row => {
    //   const component = this.vcr.createComponent(OlympicChartComponent);
    //   component.instance.data = row.data;
    //   component.instance.renderTo = document.createElement('div');
    //   component.instance.sportName = row.sport;
    //   component.instance.createChart();
    //   const hc = component.instance.chart;
    //   return from(highChartToDataUrl(hc!));
    // })).subscribe(data=>{
    //   console.log(data);
    // })


    // console.log(data);
  }
}

interface GridRowData {
  sport: string;
  data: OlympicWinner[];
  base64Image?: string;
}

