import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {MyParams} from '../types/my-params';

@Component({
  templateUrl: './goodbye.component.html',
  styleUrls: ['./goodbye.component.scss']
})
export class GoodbyeComponent implements OnInit, ICellRendererAngularComp {
  name?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams & MyParams): void {
    this.name = params.name;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

}
