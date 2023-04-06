import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { ResearchDetailComponent } from './research-detail/research-detail.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'index',component:IndexComponent},
  {path:'research-detail/:id',component:ResearchDetailComponent}
];

// {path:'home',component:HomeComponent},

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


