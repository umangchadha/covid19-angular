import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldComponent } from './world/world.component';
import { IndiaComponent } from './india/india.component';
import { HomeComponent } from './home/home.component';
import { FaqComponentComponent } from './faq-component/faq-component.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'world', component: WorldComponent },
  { path: 'faq', component: FaqComponentComponent },
  { path: 'india', component: IndiaComponent },
  { path: 'home', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
