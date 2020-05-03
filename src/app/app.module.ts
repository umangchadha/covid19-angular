import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldComponent } from './world/world.component';
import { IndiaComponent, DialogOverviewDialogComponent } from './india/india.component';
import { HomeComponent } from './home/home.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MessageService } from './message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PromptComponent } from './prompt-component/prompt-component.component';
import { PwaService } from './pwa.service';
import { FaqComponentComponent } from './faq-component/faq-component.component';

const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    IndiaComponent,
    HomeComponent,
    DialogOverviewDialogComponent,
    PromptComponent,
    FaqComponentComponent

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],

  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true }, MessageService],

  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewDialogComponent]
})


export class AppModule { }

