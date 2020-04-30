import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PwaServiceService {
  promptEvent: any;
  constructor(private swUpdate: SwUpdate) {
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
    swUpdate.available.subscribe(event => {
      if (this.promptEvent()) {
        window.location.reload();
      }
    });
  }
}




