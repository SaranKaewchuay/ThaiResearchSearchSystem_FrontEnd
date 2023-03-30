import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { ResearchDetailComponent } from './research-detail/research-detail.component';

const routes: Routes = [
  {path:'',component:IndexComponent},
  {path:'index',component:IndexComponent},
  {path:'home',component:HomeComponent},
  {path:'research-detail/:id',component:ResearchDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


