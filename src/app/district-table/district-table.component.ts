import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-district-table',
  templateUrl: './district-table.component.html',
  styleUrls: ['./district-table.component.scss']
})
export class DistrictTableComponent implements OnChanges {
  @Input() data;
  state: any;
  color: any;
  displayedColumns = ['district', 'confirmed', 'newconf', 'deceased', 'newdeaths', 'recovered', 'newrecvrd'];

  constructor(public messageData: MessageService) { }

  ngOnChanges() {
    this.state = this.data.state;
    this.color = this.messageData.data
    console.log(this.color.Kurukshetra);
  }
}
