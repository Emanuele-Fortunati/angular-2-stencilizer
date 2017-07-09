import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'stencilizer-dynamic-copy',
  templateUrl: './dynamic-copy.component.html',
  styleUrls: ['./dynamic-copy.component.css']
})
export class DynamicCopyComponent implements OnInit {

  @Input() selected: any = 0;

  @Output() onSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  select(selected: any) {
    this.onSelected.emit(selected);
  }

}
