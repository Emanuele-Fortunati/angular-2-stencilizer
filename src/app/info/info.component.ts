import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef, MdIconRegistry } from '@angular/material';

@Component({
  selector: 'stencilizer-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private sanitizer:DomSanitizer, private dialog: MdDialog,mdIconRegistry: MdIconRegistry) {
    mdIconRegistry
      .addSvgIcon('info', sanitizer.bypassSecurityTrustResourceUrl('assets/info_blue.svg'));
  }

  private pulsing: boolean = false;
  private visible: boolean = false;

  showInfo() {
    let dialogRef = this.dialog.open(MoreInfoComponent, {
      panelClass: 'stencilizer'
    });
  }

  ngOnInit() {
    // show info button after 15 seconds
    let visibilityTimer = Observable.timer(15000);
    visibilityTimer.subscribe(t=> {
      this.visible = true;
      this.pulsing = true;

      // just pulse for 7 seconds
      let pulseTimer = Observable.timer(7000);
      pulseTimer.subscribe(t=> {
        this.pulsing = false;
      });

    });
  }

}


// Dialog component
@Component({
  selector: 'stencilizer-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./info.component.css']
})
export class MoreInfoComponent implements OnInit {

  constructor() { }


  ngOnInit() {

  }


}
