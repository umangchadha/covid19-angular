import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { COUNTRIES } from './countries';
import * as _ from 'lodash';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { MessageService } from './message.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'covid';
  masterData: any = {};
  india = {};
  statewiseData: any = {};
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  constructor(private httpClient: HttpClient, public messageService:MessageService) { }

  ngOnInit() {
    this.getData();

    setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval

  }

  getData() {
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

    });
    this.httpClient.get('https://api.covid19india.org/data.json')
      .subscribe((a: any) => {
        this.statewiseData = a.statewise;
        this.india = _.filter(this.statewiseData, a => a.state === 'Total')
      });



  }

  classFinder(country) {
    const ctry = _.filter(COUNTRIES, a => a.name === country);
    if (ctry && ctry[0]) {
      return 'flag-icon flag-icon-' + (ctry[0].code).toLowerCase();
    }
  }
}
