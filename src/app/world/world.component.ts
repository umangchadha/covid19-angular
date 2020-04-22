import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import {MessageService} from '../message.service';

import { COUNTRIES } from '../countries';
import { from } from 'rxjs';
@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],

})

export class WorldComponent implements OnInit {
  title = 'covid';
  masterData: any = {};

  constructor(private httpClient: HttpClient,public messageService:MessageService) { }
  
  ngOnInit() {

    this.getData();

    setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval

  }

  getData() {
    this.messageService.spinner=true;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
        'x-rapidapi-key': '37844fb50cmshf7fa91e30393b02p144a6fjsnd76da63b95dd'
      })
    };

    this.httpClient.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', httpOptions).subscribe(a => {
      this.masterData = a;
      this.masterData.countries_stat = _.orderBy(this.masterData.countries_stat, (obj) => {
        return parseInt(obj.rhid, 10);
      }, 'cases', 'desc');
      this.messageService.spinner=false;
    });
    
  }
  classFinder(country) {
    const ctry = _.filter(COUNTRIES, a => a.name === country);
    if (ctry && ctry[0]) {
      return 'flag-icon flag-icon-' + (ctry[0].code).toLowerCase();
    }
  }


}
