import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuickstartGuideComponent} from './quickstart-guide/quickstart-guide.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EnterpriseOverviewComponent} from './enterprise-overview/enterprise-overview.component';
import {CellRenderOverviewComponent} from './cell-render-overview/cell-render-overview.component';
import {CustomComponentOverviewComponent} from './custom-component-overview/custom-component-overview.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'quickstart-guide', component: QuickstartGuideComponent},
  {path: 'enterprise-overview', component: EnterpriseOverviewComponent},
  {path: 'cell-render-overview', component: CellRenderOverviewComponent},
  {path: 'custom-component-overview', component: CustomComponentOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
