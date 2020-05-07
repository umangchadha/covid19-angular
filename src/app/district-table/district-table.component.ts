import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-district-table',
  templateUrl: './district-table.component.html',
  styleUrls: ['./district-table.component.scss']
})
export class DistrictTableComponent implements OnChanges {
  @Input() data;
  state: any;

  displayedColumns = ['district', 'confirmed', 'newconf', 'deceased', 'newdeaths', 'recovered', 'newrecvrd'];

  constructor() { }

  ngOnChanges() {
    this.state = this.data.state;
  }
}
