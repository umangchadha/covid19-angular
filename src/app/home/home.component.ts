import { Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  worldCases: any;
  dataInterval: any;
  masterData: any;
  constructor(private httpClient: HttpClient) { 
    this.getData();
  }
  
  ngOnInit(): void {
    this.dataInterval = setInterval(() => {
      this.getData();
    }, 6000000); // changed to 1 min
  }

  getData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'corona-virus-world-and-india-data.p.rapidapi.com',
        'x-rapidapi-key': '077bb06f59msh45677e8ff01aa8fp1f1d42jsn992088ab485b'
      })
    };

    this.httpClient.get('https://corona-virus-world-and-india-data.p.rapidapi.com/api', httpOptions).subscribe((a: any) => {
        this.worldCases = a.world_total;
    });

  }
  ngOnDestroy() {
    clearInterval(this.dataInterval);
  }
}
