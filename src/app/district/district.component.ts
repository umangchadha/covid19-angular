import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {

  @Input() distArr:any;
  constructor() { }

  ngOnInit(): void {
  }

}
