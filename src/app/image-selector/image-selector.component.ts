import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar, MdDialog, MdDialogRef, MdIconRegistry } from '@angular/material';
import { getUserMedia } from 'getusermedia-js';

@Component({
  selector: 'stencilizer-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  @Input() images: Array<string>;
  @Input() selected: any = 0;

  @Output() onSelected = new EventEmitter<any>();

  @ViewChild('fileOpener') fileElem:ElementRef;


  private fileReaderEnabled: boolean;
  private webcamEnabled: boolean;

  private fileReader: any;

  constructor(private snackBar: MdSnackBar, private dialog: MdDialog, mdIconRegistry: MdIconRegistry, private sanitizer:DomSanitizer) {

    mdIconRegistry
      .addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('assets/add_grey.svg'))
      .addSvgIcon('webcam', sanitizer.bypassSecurityTrustResourceUrl('assets/webcam_grey.svg'));

    if (typeof FileReader == "undefined") {
      this.fileReaderEnabled = false;
    } else {
      this.fileReaderEnabled = true;

      this.fileReader = new FileReader();
    }

    if (typeof navigator.getUserMedia == "undefined") {
      this.webcamEnabled = false;
    } else {
      this.webcamEnabled = true;
    }

  }

  ngOnInit() {
    this.onSelected.emit({ image: this.images[0], selected: this.selected });
  }

  ngOnChanges(changes: SimpleChanges) {

    if(changes.selected) {
      let timer = Observable.timer(150);

      switch(changes.selected.currentValue) {
        case 'open-add':

          timer.subscribe(t=> {
            if(!this.fileReaderEnabled) {
              this.error();
              this.selected = 'cant-add';
            } else {
              this.selected = 1;
              this.fileElem.nativeElement.click();
            }

            this.onSelected.emit({ image: null, selected: this.selected });
          });
          break;

        case 'open-webcam':

          timer.subscribe(t=> {
            if(!this.webcamEnabled) {
              this.error();
              this.selected = 'cant-webcam';
            } else {
              if(this.fileReaderEnabled) {
                this.selected = 'add';
              } else {
                this.selected = 1;
              }

              this.openWebcam();

            }

            this.onSelected.emit({ image: null, selected: this.selected });
          });
          break;
      }
    }

  }

  private error() {
    this.snackBar.open('This feature is not supported by your browser.', null, {
      duration: 2000,
      extraClasses: ['stencilizer']
    });
  }

  select(imageSrc: string, index: any) {
    this.selected = index;
    this.onSelected.emit({ image: imageSrc, selected: this.selected });
  }

  addImage() {
    if(!this.fileReaderEnabled) {
      this.error();
    }
  }

  fileAdded(event) {

    this.fileReader.onload = (file) => {

      // pass it into a canvas to make sure it is 500x500 pixels
      let canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;

      let img = new Image();
      img.onload = () => {
        canvas.getContext('2d').drawImage(img, 0, 0, 500, 500);
        this.select(canvas.toDataURL('image/png'), 'add');
      };
      img.src = file.srcElement.result;

    }

    // Read in the image file as a data URL.
    this.fileReader.readAsDataURL(event.srcElement.files[0]);

  }

  openWebcam() {
    if(!this.webcamEnabled) {
      this.error();
    } else {
      let dialogRef = this.dialog.open(ImageSelectorWebcamComponent, {
        hasBackdrop: true
      });

      // probably isnt the cleanest way....
      dialogRef.componentInstance
        .onSnapshot
        .subscribe((image) => {
          this.select(image, 'webcam');
        });
    }
  }

}




// Dialog component
@Component({
  selector: 'image-selector-webcam',
  templateUrl: './image-selector-webcam.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorWebcamComponent implements OnInit {

  @ViewChild('webcam') webcam:ElementRef;

  constructor(private rd: Renderer2, public dialogRef: MdDialogRef<ImageSelectorWebcamComponent>, mdIconRegistry: MdIconRegistry, private sanitizer:DomSanitizer) {
    mdIconRegistry
      .addSvgIcon('camera', sanitizer.bypassSecurityTrustResourceUrl('assets/camera_blue.svg'))
      .addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('assets/clear_blue.svg'));
  }

  public onSnapshot = new EventEmitter<string>();

  private stream: any;
  private nossl: boolean = true;

  ngOnInit() {

    if(location.hostname == 'localhost' || location.protocol == 'https') {
      this.nossl = false;

      // using the polyfil as one day I wish to add the flash fallback...
      getUserMedia({
        video: true,
        audio: false,
        width: 320,
        height: 240,
        el: 'webcam',
      }, stream => {
          this.startVideo(stream);
      }, err => console.error(err));

    }


    this.dialogRef.afterClosed().subscribe(() => {
      this.stream.getTracks()[0].stop();
    });

  }

  startVideo(stream) {
    var video = this.webcam.nativeElement.querySelector('video');
    var vendorURL = window.URL;// || window.webkitURL;
    video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;

    this.stream = stream;

  }

  snapshot() {
    var video = this.webcam.nativeElement.querySelector('video');
    var canvas = this.webcam.nativeElement.querySelector('canvas');
    canvas.width = 500;
    canvas.height = 500
    canvas.getContext('2d').drawImage(video, 0, 0, 500, 375);

    this.onSnapshot.emit(canvas.toDataURL('image/png'));
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }


}

