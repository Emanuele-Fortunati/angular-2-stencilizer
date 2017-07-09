import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, Inject, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSliderChange, MdSnackBar, MdIconRegistry } from '@angular/material';
import * as ImageTracer  from 'imagetracerjs/imagetracer_v1.2.0';
import downloadjs from 'downloadjs';


// main component

@Component({
  selector: 'stencilizer-image-stencilizer',
  templateUrl: './image-stencilizer.component.html',
  styleUrls: ['./image-stencilizer.component.css']
})
export class ImageStencilizerComponent implements OnInit {

  @Input() image: string;
  @Input() notDownloadable: Array<string>;
  @Input() notDownloadableMessage: string;

  @ViewChild('converter') canvasElem:ElementRef;

  saitizer: null;
  svg: string = '';

  options: any = {
    numberofcolors: 14,
    colorquantcycles: 5,
    pathomit: 8
  };
  cache: any = {};
  snackbarRef: any;

  loader: boolean = false;

  private downloadable: boolean;
  private settings: boolean = false;

  constructor(private snackBar: MdSnackBar, private sanitizer:DomSanitizer, private dialog: MdDialog, private rd: Renderer2, mdIconRegistry: MdIconRegistry) {

    mdIconRegistry
      .addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('assets/settings_grey.svg'))
      .addSvgIcon('download', sanitizer.bypassSecurityTrustResourceUrl('assets/download_grey.svg'));


    if(window.URL && window.URL.createObjectURL) {
      this.downloadable = true;
    } else {
      this.downloadable = false;
    }
  }

  ngOnInit() {
//     this.svg = this.image;
  }

  ngOnChanges(changes: SimpleChanges) {

    // delay to allow the original image to be seen first
    this.loader = true;
    this.svg = '';

    let timer = Observable.timer(350);
    timer.subscribe(t=> {
      let image = new Image();
      image.onload = () => {
        this.trace(image);

        this.loader = false;
        image = undefined;
      }
      image.src = this.image;
    });

  }

  openSettings() {
    this.settings = true;

    let dialogRef = this.dialog.open(StencilizerSettingsComponent, {
      position: { bottom:'0px' },
      hasBackdrop: false,
      data: {
        value: this.options.numberofcolors
      }
    });

    // probably isnt the cleanest way....
    dialogRef.componentInstance
      .onRefresh
      .subscribe((value) => {
        this.options.numberofcolors = value;

        this.loader = true;
        let timer = Observable.timer(35);
        timer.subscribe(t=> {
          this.trace(null);
          this.loader = false;
        });

      });

    dialogRef.afterClosed()
      .subscribe(() => {
        this.settings = false;
      });

  }

  trace(image: any) {

    // load from cache
    if(this.cache && this.cache[this.image + '-' + this.options.numberofcolors]) {

      this.svg = this.cache[this.image + '-' + this.options.numberofcolors].data;

    } else {

      // create SVG
      let context = this.canvasElem.nativeElement.getContext("2d");
      if(image) {
    		context.drawImage(image, 0, 0);
      }

  	 	// Synchronous tracing to SVG string
  	 	var imgd = ImageTracer.getImgdata( this.canvasElem.nativeElement );
  	 	var svgstr = ImageTracer.imagedataToSVG( imgd, this.options );

      this.svg = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml;utf8,' + svgstr) as string;

      this.cache[this.image + '-' + this.options.numberofcolors] = {
        data: this.svg,
        rawData: 'data:image/svg+xml;utf8,' + svgstr
      };
    }



  }

  download() {
    if(!this.downloadable) {
      this.error('This feature is not supported by your browser.');
    } else if(this.notDownloadable.indexOf(this.image) != -1) {
      this.error(this.notDownloadableMessage);
    } else {

      let context = this.canvasElem.nativeElement.getContext("2d");
    	let image = new Image();

    	image.onload = () => {
    		context.drawImage(image, 0, 0);
    		downloadjs(this.canvasElem.nativeElement.toDataURL('image/png', 1.0), 'stencilized.png', 'image/png');
    	}

    	image.src = this.cache[this.image].rawData;

    }
  }

  private error(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
      extraClasses: ['stencilizer']
    });
  }

}


// Dialog component
@Component({
  selector: 'stencilizer-stencilizer-settings',
  templateUrl: './stencilizer-settings.component.html',
  styleUrls: ['./image-stencilizer.component.css']
})
export class StencilizerSettingsComponent implements OnInit {

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<StencilizerSettingsComponent>, mdIconRegistry: MdIconRegistry, private sanitizer:DomSanitizer) {

    mdIconRegistry
      .addSvgIcon('refresh', sanitizer.bypassSecurityTrustResourceUrl('assets/refresh_blue.svg'))
      .addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('assets/clear_blue.svg'));

  }

  currentValue: any;

  public onRefresh = new EventEmitter<string>();

  ngOnInit() {
    this.currentValue = this.data.value;
  }

  update(data: MdSliderChange) {
    this.currentValue = data.value;
  }

  close() {
    this.dialogRef.close();
  }

  refresh() {
    this.onRefresh.emit(this.currentValue);
  }


}
