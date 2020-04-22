import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorldComponent} from './world/world.component';
import {IndiaComponent} from './india/india.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"World",component:WorldComponent},
  {path:"India",component:IndiaComponent},
  {path:"Home",component:HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
