import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuickstartGuideComponent} from './quickstart-guide/quickstart-guide.component';
import {DashboardComponent} from './dashboard/dashboard.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'quickstart-guide', component: QuickstartGuideComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
