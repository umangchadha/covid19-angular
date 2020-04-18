import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {COUNTRIES} from '../countries';
import * as _ from 'lodash';

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.getData();

    setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval

  }


  getData() {
    this.httpClient.get('https://api.covid19india.org/data.json')
      .subscribe((a: any) => {
        this.statewiseData = a.statewise;
        this.india = _.filter(this.statewiseData, a => a.state === 'Total')
      });
    }
}
