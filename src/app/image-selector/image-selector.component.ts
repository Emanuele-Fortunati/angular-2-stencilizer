import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'stencilizer-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit {

  @Input() images: any[];

  @Output() onSelected = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.onSelected.emit(this.images[0]);
  }

  select(imageSrc: string) {
    this.onSelected.emit(imageSrc);
  }

}
