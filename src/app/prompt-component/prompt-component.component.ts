import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-prompt-component',
  templateUrl: './prompt-component.component.html',
  styleUrls: ['./prompt-component.component.scss']
})

export class PromptComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { mobileType: 'ios' | 'android', promptEvent?: any },
    private bottomSheetRef: MatBottomSheetRef<PromptComponent>, private messageService: MessageService
  ) {
    this.messageService.ios = this.data.mobileType;
  }

  public installPwa(): void {
    this.data.promptEvent.prompt();
    this.messageService.ios = this.data.mobileType;
    this.close();
  }

  public close() {
    this.bottomSheetRef.dismiss();
  }

}
