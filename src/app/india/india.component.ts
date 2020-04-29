import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  timeSeries: any;




  constructor(private httpClient: HttpClient, public message: MessageService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getData();
    this.getStateData();
    setInterval(() => {
      this.getData();
    }, 10000); // 10 sec interval
  }

  openDialog(statecode, state): void {
    const dialogRef = this.dialog.open(DialogOverviewDialogComponent, {
      width: '100%',
      data: { allData: this.timeSeries, stateCode: statecode.toLowerCase(), stateName: state }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

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
    this.httpClient.get('https://api.covid19india.org/states_daily.json')
      .subscribe((a: any) => {
        this.timeSeries = a;
      });
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


  colorScheme = {
    domain: ['#CFC0BB', '#5AA454', '#E44D25']
  };
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  createGraphData() {
    if (this.data.allData) {
      const recoverArr = [];
      const confirmedArr = [];
      const deceasedArr = [];
      this.data.allData.states_daily.filter(a => {
        if (a.status === 'Recovered') {
          const x = {
            value: a[this.data.stateCode],
            name: a.date
          };
          recoverArr.push(x);
        }
        if (a.status === 'Confirmed') {
          const x = {
            value: a[this.data.stateCode],
            name: a.date
          };
          confirmedArr.push(x);
        }
        if (a.status === 'Deceased') {
          const x = {
            value: a[this.data.stateCode],
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

      return obj;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}