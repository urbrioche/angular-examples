import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';

export default interface MyCellParams {
  buttonText: string;
}

@Component({
  selector: 'app-my-cell',
  templateUrl: './my-cell.component.html',
  styleUrls: ['./my-cell.component.scss']
})
export class MyCellComponent implements OnInit, ICellRendererAngularComp {
  value: any;
  buttonText: string = 'Default';

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams & MyCellParams): void {
    this.value = params.value;
    this.buttonText = params.buttonText ?? this.buttonText;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  click(event: MouseEvent) {
    alert(`Cell value is ${this.value}`);
  }
}
