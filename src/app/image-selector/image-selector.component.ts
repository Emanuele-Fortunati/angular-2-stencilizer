import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSnackBar, MdDialog, MdDialogRef, MdIconRegistry } from '@angular/material';
import { getUserMedia } from 'getusermedia-js';

@Component({
  selector: 'stencilizer-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  @Input() images: Array<string>;

  @Output() onSelected = new EventEmitter<string>();


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
    this.onSelected.emit(this.images[0]);
  }

  private error() {
    this.snackBar.open('This feature is not supported by your browser.', null, {
      duration: 2000,
      extraClasses: ['stencilizer']
    });
  }

  select(imageSrc: string) {
    this.onSelected.emit(imageSrc);
  }

  addImage() {
    if(!this.fileReaderEnabled) {
      this.error();
    }
  }

  fileAdded(event) {

    this.fileReader.onload = (file) => {
      this.select(file.srcElement.result);
    }

    // Read in the image file as a data URL.
    this.fileReader.readAsDataURL(event.srcElement.files[0]);

  }

  openWebcam() {
    let dialogRef = this.dialog.open(ImageSelectorWebcamComponent, {
      hasBackdrop: true
    });

    // probably isnt the cleanest way....
    dialogRef.componentInstance
      .onSnapshot
      .subscribe((image) => {
        this.select(image);
      });
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

  constructor(private rd: Renderer2, public dialogRef: MdDialogRef<ImageSelectorWebcamComponent>) { }

  public onSnapshot = new EventEmitter<string>();

  private stream: any;

  ngOnInit() {

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
    canvas.width = video.width;
    canvas.height = video.height;
    canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height);

    this.onSnapshot.emit(canvas.toDataURL("image/png"));
    this.dialogRef.close();
  }


}

