import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaServiceService {
  promptEvent: any;
  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', event => {
      if(confirm("add this application")){
        console.log("before install prompt");
      }
    });
    swUpdate.available.subscribe(event => {
      if (confirm('New version available! would you like to update?')) {
        window.location.reload();
      }
    });
  }

}




