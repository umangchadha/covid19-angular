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
  constructor(private httpClient: HttpClient) { 
    this.getData();
  }
  
  ngOnInit(): void {
    this.dataInterval = setInterval(() => {
      this.getData();
    }, 6000);
  }

  getData() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-host': 'coronavirus-monitor.p.rapidapi.com',
		    'x-rapidapi-key': '077bb06f59msh45677e8ff01aa8fp1f1d42jsn992088ab485b'
      })
    };

    this.httpClient.get('https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php', httpOptions).subscribe(a => {
        this.worldCases = a;
    });

  }
  ngOnDestroy() {
    clearInterval(this.dataInterval);
  }
}
