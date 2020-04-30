import { Component, OnInit } from '@angular/core';
import { PwaServiceService } from '../services/pwa-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public Pwa: PwaServiceService) { }
  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }

  ngOnInit(): void {
  }

}
