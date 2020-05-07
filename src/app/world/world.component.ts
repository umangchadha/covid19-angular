import { Component, OnChanges, OnDestroy,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../message.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, count} from 'rxjs/operators';
import { COUNTRIES } from '../countries';
import * as _ from 'lodash';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.scss'],

})

export class WorldComponent implements OnChanges, OnDestroy {
  title = 'covid';
  masterData: any = {};
  show: any = false;
  dataInterval: any;
  updateTimestamp: any;
  searchedData: any;
  countriesArr: any;
  filterName: any;
  constructor(private httpClient: HttpClient, public messageService: MessageService) { this.getData(); }


  ngOnChanges() {
    this.dataInterval = setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval  
  }

  getData() {
    this.messageService.spinner = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
        'x-rapidapi-key': '37844fb50cmshf7fa91e30393b02p144a6fjsnd76da63b95dd'
      })
    };

    this.httpClient.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php', httpOptions).subscribe(a => {
      this.masterData = a;
      this.masterData.countries_stat = _.orderBy(this.masterData.countries_stat,
        [obj => parseFloat(obj.cases.replace(/,/g, ''))], ['desc']);

      this.searchedData= _.cloneDeep(this.masterData.countries_stat);
      this.updateTimestamp = this.masterData.statistic_taken_at;
      this.messageService.spinner = false;
    });

  }

  getCountry(country){
    if (country.length > 0){
      let ctr = country.toLowerCase();
      ctr = ctr.trim();
      this.masterData.countries_stat = this.searchedData;
      this.masterData.countries_stat = this.masterData.countries_stat.filter(a => (a.country_name).toLowerCase().startsWith(ctr));
    }
    else{
      this.masterData.countries_stat = this.searchedData;
    }
  }
  clear(){
    this.filterName = "";
    this.masterData.countries_stat = this.searchedData;

  }

  classFinder(country) {
    const ctry = _.filter(COUNTRIES, a => a.name === country);
    if (ctry && ctry[0]) {
      return 'flag-icon flag-icon-' + (ctry[0].code).toLowerCase();
    }
  }
  showHide(country) {
    this.show = country ? true : false;
  }

  ngOnDestroy() {
    clearInterval(this.dataInterval);
  }
}
