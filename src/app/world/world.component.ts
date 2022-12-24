import { Component, OnChanges, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../message.service';
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
  selectOptions: any = [
    {value: 'nofilter', viewValue: 'No Filter'},
    {value: 'confirmed', viewValue: 'Confirmed'},
    {value: 'deaths', viewValue: 'Deaths'},
    {value: 'recovered', viewValue: 'Recovered%'},
    {value: 'active', viewValue: 'Active'},
    {value: 'alphabetical', viewValue: 'Alphabetical'},
  ];
  show: any = false;
  dataInterval: any;
  filterName: any;
  searchedData: any;
  updateTimestamp: any;
  constructor(private httpClient: HttpClient, public messageService: MessageService) {
    this.getData();

  }

  ngOnChanges() {
    this.dataInterval = setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval

  }

  getData() {
    this.messageService.spinner = true;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
        'x-rapidapi-key': '077bb06f59msh45677e8ff01aa8fp1f1d42jsn992088ab485b'
      })
    };

    this.httpClient.get('https://corona-virus-world-and-india-data.p.rapidapi.com/api', httpOptions).subscribe(a => {
      this.masterData = a;
      this.masterData.countries_stat = _.orderBy(this.masterData.countries_stat,
        [obj => parseFloat(obj.cases.replace(/,/g, ''))], ['desc']);
      this.masterData.countries_stat.map( (a) => a.percentage= ((parseInt(a.total_recovered.replace(/\,/g,''))/parseInt(a.cases.replace(/\,/g,'')))*100).toFixed(0));
      this.masterData.countries_stat.map( (a) => a.death_percentage= ((parseInt(a.deaths.replace(/\,/g,''))/parseInt     (a.cases.replace(/\,/g,'')))*100).toFixed(0));
      this.masterData.countries_stat.map( (a) => a.active_cal= (parseInt(a.cases.replace(/\,/g,''))-(parseInt(a.deaths.replace(/\,/g,''))+parseInt(a.total_recovered.replace(/\,/g,'')))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      console.log(this.masterData.countries_stat)
      this.searchedData = _.cloneDeep(this.masterData.countries_stat);
      this.updateTimestamp = this.masterData.statistic_taken_at;
      this.messageService.spinner = false;
    });

  }


  sortData(event){
    if ( event == "deaths" ){
      this.masterData.countries_stat.sort(function (a, b) {
      return parseInt((b.deaths).replace(/\,/g,'')) - parseInt((a.deaths).replace(/\,/g,''));
    })
  }
  else if(event == "confirmed"){
        this.masterData.countries_stat.sort(function (a, b) {
        return parseInt((b.cases).replace(/\,/g,'')) - parseInt((a.cases).replace(/\,/g,''));
    })
  }
  else if(event == "recovered"){
    let temp = [];
    let temp1 = [];
    temp = this.masterData.countries_stat.filter(a => a.total_recovered != "N/A");
    temp1 = this.masterData.countries_stat.filter(a => a.total_recovered == "N/A");
    this.masterData.countries_stat = [...temp,...temp1];
    this.masterData.countries_stat.sort(function (a, b) {
          return parseInt((b.percentage).replace(/\,/g,'')) - parseInt((a.percentage).replace(/\,/g,''));
    })
  }
  else if(event == "active"){
    let temp = [];
    let temp1 = [];
    temp = this.masterData.countries_stat.filter(a => a.total_recovered != "N/A");
    temp1 = this.masterData.countries_stat.filter(a => a.total_recovered == "N/A");
    this.masterData.countries_stat = [...temp,...temp1];

    this.masterData.countries_stat.sort(function (a, b) {
        return parseInt((b.active_cal).replace(/\,/g,'')) - parseInt((a.active_cal).replace(/\,/g,''));
  })
}
  else if(event == "alphabetical"){
    this.masterData.countries_stat.sort(function(a, b){
    var nameA=a.country_name.toLowerCase(), nameB=b.country_name.toLowerCase()
    if (nameA < nameB) //sort string ascendin
          return -1 
          if (nameA > nameB)
              return 1
          return 0 //default return value (no sorting)
      })
    }else if(event == "nofilter"){
      this.masterData.countries_stat = _.orderBy(this.masterData.countries_stat,
      [obj => parseFloat(obj.cases.replace(/,/g, ''))], ['desc']);
    }


  }


  getCountry(country) {
    if (country.length > 0) {
      let ctr = country.toLowerCase();
      ctr = ctr.trim();
      this.masterData.countries_stat = this.searchedData;
      this.masterData.countries_stat = this.masterData.countries_stat.filter(a => (a.country_name).toLowerCase().startsWith(ctr));
    }
    else {
      this.messageService.spinner = true;
      this.masterData.countries_stat = [];
      setTimeout(() => {
        this.masterData.countries_stat = this.searchedData;
      }, 1000);
      setTimeout(() => {
        this.messageService.spinner = false;
      }, 3000);
    }
  }

  clear(filterName) {
    if (filterName && filterName.length > 0) {
      this.filterName = '';
      this.getCountry('');
    }
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
