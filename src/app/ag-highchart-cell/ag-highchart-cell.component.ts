import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {OlympicWinner} from '../types/olympic.winner';

@Component({
  selector: 'app-ag-highchart-cell',
  templateUrl: './ag-highchart-cell.component.html',
  styleUrls: ['./ag-highchart-cell.component.scss']
})
export class AgHighchartCellComponent implements OnInit, ICellRendererAngularComp {
  data: OlympicWinner[] | undefined;
  sportName: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams<{ sport: string, data: OlympicWinner[] }>): void {
    this.data = params.data?.data;
    this.sportName = params.data?.sport;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

}
