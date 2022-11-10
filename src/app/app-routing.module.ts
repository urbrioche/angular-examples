import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuickstartGuideComponent} from './quickstart-guide/quickstart-guide.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {EnterpriseOverviewComponent} from './enterprise-overview/enterprise-overview.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'quickstart-guide', component: QuickstartGuideComponent},
  {path: 'enterprise-overview', component: EnterpriseOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
