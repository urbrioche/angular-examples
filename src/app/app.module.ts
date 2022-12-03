import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {QuickstartGuideComponent} from './quickstart-guide/quickstart-guide.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AgGridModule} from 'ag-grid-angular';
import {HttpClientModule} from '@angular/common/http';
import {EnterpriseOverviewComponent} from './enterprise-overview/enterprise-overview.component';
// enable enterprise features
import 'ag-grid-enterprise';
import {MyCellComponent} from './my-cell/my-cell.component';
import {OverComponent} from './over/over.component';
import {UnderComponent} from './under/under.component';
import {CellRenderOverviewComponent} from './cell-render-overview/cell-render-overview.component';
import {CustomComponentOverviewComponent} from './custom-component-overview/custom-component-overview.component';
import {MyCustomComponent} from './my-custom/my-custom.component';
import {HelloComponent} from './hello/hello.component';
import {GoodbyeComponent} from './goodbye/goodbye.component';
import {HighchartInGridOverviewComponent} from './highchart-in-grid-overview/highchart-in-grid-overview.component';
import {OlympicChartComponent} from './olympic-chart/olympic-chart.component';
import {AgHighchartCellComponent} from './ag-highchart-cell/ag-highchart-cell.component';
import {PlotlyContourComponent} from './plotly-contour/plotly-contour.component';
import * as PlotlyJS from 'plotly.js-dist-min';
// 不要寫成下面的import，因為根本沒裝plotly.js的package，但裝@types/plotly.js-dist-min幫你裝了@types/plotly.js
// 因為@types/plotly.js-dist-min depends on @types/plotly.js
// 寫成下面會compile error
// import * as PlotlyJS from 'plotly.js';
import {PlotlyModule} from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    QuickstartGuideComponent,
    DashboardComponent,
    EnterpriseOverviewComponent,
    MyCellComponent,
    OverComponent,
    UnderComponent,
    CellRenderOverviewComponent,
    CustomComponentOverviewComponent,
    MyCustomComponent,
    HelloComponent,
    GoodbyeComponent,
    HighchartInGridOverviewComponent,
    OlympicChartComponent,
    AgHighchartCellComponent,
    PlotlyContourComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule,
    PlotlyModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
