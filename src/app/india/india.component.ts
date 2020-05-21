import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import * as _ from 'lodash';
import { MessageService } from '../message.service';
import * as D3 from 'd3';

@Component({
  selector: 'app-india',
  templateUrl: './india.component.html',
  styleUrls: ['./india.component.scss']
})
export class IndiaComponent implements OnInit, OnDestroy {
  title = 'covid';
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  masterData: any = {};
  india = {};
  statewiseData: any;
  timeSeries: any;
  dataInterval: any;
  stateDataInterval: any;
  distDataInterval: any;
  distDataAll: any;
  districtDataOne: any = [];
  indiaGraph: any = [];
  temp: any;
  copyStatewise: any;
  filterName: any;
  options: any;
  indiaTimeSeries;
  showMessage: boolean = false;
  colorScheme = {
    domain: ['#CFC0BB', '#5AA454', '#E44D25']
  };

  interpolation = D3.curveBasisOpen;
  view: any = [];
  constructor(private httpClient: HttpClient, public message: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    // call all the APIs on load

    this.getData();
    this.getStateData();
    this.getDisttData();

    // graph size
    const smallScreen = window.innerWidth < 600;
    if (smallScreen) {
      this.view = [window.innerWidth - 50, window.innerWidth - 100];
    } else {
      this.view = [window.innerWidth - 100, 400];
    }


    // set the timer for all the APIs

    this.dataInterval = setInterval(() => {
      this.getData();
    }, 1000000); // 10 sec interval

    this.stateDataInterval = setInterval(() => {
      this.getStateData();
    }, 6000000); // 1 min

    this.distDataInterval = setInterval(() => {
      this.getDisttData();
    }, 6000000); // 1 min
  }

  getData() {
    this.message.spinner = true;
    this.httpClient.get('https://api.covid19india.org/data.json')
      .subscribe((a: any) => {
        this.statewiseData = a.statewise;
        this.statewiseData.map(( a ) => a.percentage = ((a.recovered / a.confirmed ) * 100).toFixed(0) )
        this.indiaTimeSeries = a.cases_time_series;
        this.temp = this.statewiseData.filter( a => a.state !== 'Total');
        this.options = this.temp.map( a => a.state);
        this.copyStatewise = _.cloneDeep(this.statewiseData);

        this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
        this.india = _.filter(this.statewiseData, (b: any) => b.state === 'Total');
        this.createIndiaGraph();
      });

    this.message.spinner = false;
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
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

  getState(state){
    if ( state.length > 0){
      let states = state.toLowerCase();
      states = states.trim();
      this.statewiseData = this.copyStatewise;
      this.statewiseData = this.statewiseData.filter(a => (a.state).toLowerCase().startsWith(states));

    }
    else{
      this.statewiseData = this.copyStatewise;
    }
  }
  // clear search
  clear(){
    if (this.filterName){
      this.filterName = "";
      this.getState('');
    }else{
      this.filterName = "";
    }
  }

  createDistrictData(state, i) {
    if (this.districtDataOne.state === state) {
      this.districtDataOne = [];
      return;
    }
    this.districtDataOne = [];

    if (this.distDataAll) {
      if (this.distDataAll.filter(a => a.state === state)[0]) {
        this.districtDataOne = this.distDataAll.filter(a => a.state === state)[0].districtData;
        this.districtDataOne = _.orderBy(this.districtDataOne, ['confirmed'], ['desc']);
        this.districtDataOne.index = i;
        this.districtDataOne.state = state;
      } else {
        this.dialog.open(DialogOverviewDialogComponent, {
          data: { message: 'District data not available!', type: 'normal' }
        });
      }
    }



  }

  createIndiaGraph() {
    if (this.indiaTimeSeries) {

      const totalConfirmed = [];
      const totalDeceased = [];
      const totalRecovered = [];
      this.indiaTimeSeries.map(a => {
        const mon = a.date.substring(3, 6); // only showing from month of March
        if (!(mon === 'Jan' || mon === 'Feb')) {
          const y = {
            value: a.dailyconfirmed,
            name: a.date.substring(0, 6)
          };
          totalConfirmed.push(y);

          const z = {
            value: a.dailydeceased,
            name: a.date.substring(0, 6)
          };

          totalDeceased.push(z);

          const d = {
            value: a.dailyrecovered,
            name: a.date.substring(0, 6)
          };

          totalRecovered.push(d);

        }
      });
      this.indiaGraph = [{
        name: 'Confirmed',
        series: totalConfirmed
      }, {
        name: 'Recovered',
        series: totalRecovered
      }, {
        name: 'Deceased',
        series: totalDeceased
      }];
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
      data: { allData: obj, stateName: state.state, stateInfo: state, type: 'graph' }
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
  templateUrl: 'graph-dialog.html',
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

  interpolation = D3.curveBasisOpen;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.type === 'graph') {
      const todayConf = this.data.allData.filter(a => a.name === 'Confirmed')[0];
      this.confToday = todayConf.series[todayConf.series.length - 1];


      const todayRec = this.data.allData.filter(a => a.name === 'Recovered')[0];
      this.recoveredToday = todayRec.series[todayRec.series.length - 1];

      const todayDie = this.data.allData.filter(a => a.name === 'Deceased')[0];
      this.diedToday = todayDie.series[todayDie.series.length - 1];
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
