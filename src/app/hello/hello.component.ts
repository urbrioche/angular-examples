import {Component, OnInit} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {MyParams} from '../types/my-params';

@Component({
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit, ICellRendererAngularComp {
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
