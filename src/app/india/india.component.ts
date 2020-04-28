import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-india',
  templateUrl: './india.component.html',
  styleUrls: ['./india.component.scss']
})
export class IndiaComponent implements OnInit {
  title = 'covid';
  masterData: any = {};
  india = {};
  statewiseData: any;
  view: any[] = [600, 400];
  timeSeries: any;


  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;

  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  public single = [
    {
      "name": "China",
      "value": 2243772
    },
    {
      "name": "USA",
      "value": 1126000
    },
    {
      "name": "Norway",
      "value": 296215
    },
    {
      "name": "Japan",
      "value": 257363
    },
    {
      "name": "Germany",
      "value": 196750
    },
    {
      "name": "France",
      "value": 204617
    }
  ];

  public multi = [
    {
      "name": "China",
      "series": [
        {
          "name": "2018",
          "value": 2243772
        },
        {
          "name": "2017",
          "value": 1227770
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "2018",
          "value": 1126000
        },
        {
          "name": "2017",
          "value": 764666
        }
      ]
    },

    {
      "name": "Norway",
      "series": [
        {
          "name": "2018",
          "value": 296215
        },
        {
          "name": "2017",
          "value": 209122
        }
      ]
    },

    {
      "name": "Japan",
      "series": [
        {
          "name": "2018",
          "value": 257363
        },
        {
          "name": "2017",
          "value": 205350
        }
      ]
    },

    {
      "name": "Germany",
      "series": [
        {
          "name": "2018",
          "value": 196750
        },
        {
          "name": "2017",
          "value": 129246
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "2018",
          "value": 204617
        },
        {
          "name": "2017",
          "value": 149797
        }
      ]
    }
  ];


  constructor(private httpClient: HttpClient, public message: MessageService) { }

  ngOnInit() {
    this.getData();

    setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval
  }

  getData() {
    this.message.spinner = true;
    this.httpClient.get('https://api.covid19india.org/data.json')
      .subscribe((a: any) => {
        this.statewiseData = a.statewise;
        this.india = _.filter(this.statewiseData, (b: any) => b.state === 'Total');
        this.getStateData();
      });

    this.message.spinner = false;
  }

  getStateData() {
    this.httpClient.get('https://api.covid19india.org/states_daily.json')
      .subscribe((a: any) => {
        this.timeSeries = a;
      });
  }

  createGraphData(stateCode) {
    if (this.timeSeries) {
      let seriesArr = [];

      this.timeSeries.states_daily.map(a => {
        if (a.status === 'Confirmed') {
          const x = {
            date: a.date,
            confirmed: a.stateCode,
          };
          seriesArr.push(x);
        }
        if (a.status === 'Recovered') {
          const x = {
            date: a.date,
            recovered: a.stateCode
          };
          seriesArr.push(x);
        }
        if (a.status === 'Deceased') {
          const x = {
            date: a.date,
            deceased: a.stateCode
          };
          seriesArr.push(x);
        }
      });

      const uniqDates = _.uniq(seriesArr.map(a => a.date));

      const sA = uniqDates.map(a => {
        const y: any = {};
        seriesArr.filter(b => {
          y.date = b.date;
          if (b.date === a && b.confirmed) {
            y.confirmed = b.confirmed;
          }
          if (b.date === a && b.deceased) {
            y.deceased = b.deceased;
          }
          if (b.date === a && b.recovered) {
            y.recovered = b.recovered;
          }
        });

        return y;
      });
      seriesArr = sA;
      const obj = [{
        name: stateCode,
        series: seriesArr
      }];
      console.log(obj);
    }
  }
}
