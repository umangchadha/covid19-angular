import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as _ from 'lodash';
import { MessageService } from '../message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-india',
  templateUrl: './india.component.html',
  styleUrls: ['./india.component.scss']
})
export class IndiaComponent implements OnInit, OnDestroy {
  title = 'covid';
  masterData: any = {};
  india = {};
  statewiseData: any;
  timeSeries: any;
  dataInterval: any;
  stateDataInterval: any;
  distDataInterval: any;
  distDataAll: any;
  districtDataOne: any = [];

  constructor(private httpClient: HttpClient, public message: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    // call all the APIs on load 
    this.getData();
    this.getStateData();
    this.getDisttData();

    // set the timer for all the APIs

    this.dataInterval = setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval

    this.stateDataInterval = setInterval(() => {
      this.getStateData();
    }, 60000); // 1 min

    this.distDataInterval = setInterval(() => {
      this.getDisttData();
    }, 60000); // 1 min
  }

  getData() {
    this.message.spinner = true;
    this.httpClient.get('https://api.covid19india.org/data.json')
      .subscribe((a: any) => {
        this.statewiseData = a.statewise;
        this.india = _.filter(this.statewiseData, (b: any) => b.state === 'Total');
      });

    this.message.spinner = false;
  }

  getStateData() {
    this.message.spinner = true;
    this.httpClient.get('https://api.covid19india.org/states_daily.json')
      .subscribe((a: any) => {
        this.timeSeries = a;
      });
    this.message.spinner = false;
  }
  getDisttData() {
    this.httpClient.get('https://api.covid19india.org/v2/state_district_wise.json')
      .subscribe((a: any) => {
        this.distDataAll = a;
      });
  }

  createDistrictData(state, i) {
    if (this.distDataAll) {
      this.districtDataOne = this.distDataAll.filter(a => a.state === state)[0].districtData;
      this.districtDataOne.index = i;
    }
  }


  createGraphData(state) {
    this.message.spinner = true;
    if (this.timeSeries) {
      const recoverArr = [];
      const confirmedArr = [];
      const deceasedArr = [];
      this.timeSeries.states_daily.filter(a => {
        if (a.status === 'Recovered') {
          const x = {
            value: a[state.statecode.toLowerCase()],
            name: a.date
          };
          recoverArr.push(x);
        }
        if (a.status === 'Confirmed') {
          const x = {
            value: a[state.statecode.toLowerCase()],
            name: a.date
          };
          confirmedArr.push(x);
        }
        if (a.status === 'Deceased') {
          const x = {
            value: a[state.statecode.toLowerCase()],
            name: a.date
          };
          deceasedArr.push(x);
        }
      });
      const obj = [{
        name: 'Confirmed',
        series: confirmedArr
      },
      {
        name: 'Recovered',
        series: recoverArr
      },
      {
        name: 'Deceased',
        series: deceasedArr
      }
      ];
      this.openDialog(obj, state);
      this.message.spinner = false;
    }
  }
  openDialog(obj, state): void {
    const dialogRef = this.dialog.open(DialogOverviewDialogComponent, {
      width: '100%',
      height: '65%',
      data: { allData: obj, stateName: state.state, stateInfo: state }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
  ngOnDestroy() {
    clearInterval(this.stateDataInterval);
    clearInterval(this.dataInterval);
    clearInterval(this.distDataInterval);
  }

}

@Component({
  selector: 'app-overview-example-dialog',
  templateUrl: 'example-dialog.html',
})
export class DialogOverviewDialogComponent {

  // options
  showLabels = false;
  showGridLines = false;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Dates';
  yAxisLabel = 'Cases';
  results = [];
  confToday;
  recoveredToday;
  diedToday;
  colorScheme = {
    domain: ['#CFC0BB', '#5AA454', '#E44D25']
  };
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    const todayConf = this.data.allData.filter(a => a.name === 'Confirmed')[0];
    this.confToday = todayConf.series[todayConf.series.length - 1];


    const todayRec = this.data.allData.filter(a => a.name === 'Recovered')[0];
    this.recoveredToday = todayRec.series[todayRec.series.length - 1];

    const todayDie = this.data.allData.filter(a => a.name === 'Deceased')[0];
    this.diedToday = todayDie.series[todayDie.series.length - 1];
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
