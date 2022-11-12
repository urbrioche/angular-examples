import {Component, OnInit} from '@angular/core';
import {IHeaderAngularComp} from 'ag-grid-angular';
import {IHeaderParams} from 'ag-grid-community';

export interface MyParams {
  name: string;
}

@Component({
  templateUrl: './my-custom.component.html',
  styleUrls: ['./my-custom.component.scss']
})
export class MyCustomComponent implements OnInit, IHeaderAngularComp {

  name?: string;

  constructor() {
  }

  ngOnInit(): void {
  }
  ;

  agInit(params: IHeaderParams & MyParams): void {
    this.name = params.name;
  }

  refresh(params: IHeaderParams): boolean {
    return false;
  }

}
