import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdSnackBar } from '@angular/material';
import * as ImageTracer  from 'imagetracerjs/imagetracer_v1.2.0';


@Component({
  selector: 'stencilizer-stencilizer-settings',
  templateUrl: './stencilizer-settings.component.html',
  styleUrls: ['./image-stencilizer.component.css']
})
export class StencilizerSettingsComponent {

}


@Component({
  selector: 'stencilizer-image-stencilizer',
  templateUrl: './image-stencilizer.component.html',
  styleUrls: ['./image-stencilizer.component.css']
})
export class ImageStencilizerComponent implements OnInit {

  @Input() image: string;

  saitizer: null;
  svg: string;

  options: any;

  cache: any;

  constructor(private sanitizer:DomSanitizer, public snackBar: MdSnackBar) {
    this.sanitizer = sanitizer;

    this.svg = '';

    this.options = {
      numberofcolors: 5,
      colorquantcycles: 5,
      pathomit: 8
    }

    this.cache = {};
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.trace(0);
  }

  openSnackBar() {
    this.snackBar.openFromComponent(StencilizerSettingsComponent, {
      duration: 500,
    });
  }

  tracing = false;

  trace(timeout: number) {

    // load from cache
    if(this.cache && this.cache[this.image] && this.cache[this.image].numberofcolors == this.options.numberofcolors && this.cache[this.image].pathomit == this.options.pathomit) {

      this.svg = this.cache[this.image].data;
      this.image = '';

    } else {

      // create SVG
      ImageTracer.imageToSVG( this.image, (svgstr) => {

        this.svg = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml;utf8,' + svgstr) as string;

        this.cache[this.image] = {
          data: this.svg,
          numberofcolors: this.options.numberofcolors,
          pathomit: this.options.pathomit
        };

        this.image = '';

      }, this.options)

    }

  }

}


