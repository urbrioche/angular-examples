import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-my-cell',
  templateUrl: './my-cell.component.html',
  styleUrls: ['./my-cell.component.scss']
})
export class MyCellComponent implements OnInit, ICellRendererAngularComp {
  value: any;

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  click(event: MouseEvent) {
    alert(`Cell value is ${this.value}`);
  }
}
