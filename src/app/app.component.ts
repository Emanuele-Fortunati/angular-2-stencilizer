import { Component } from '@angular/core';

@Component({
  selector: 'stencilizer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stencilizer';
  imageSrc = '';

  onSelected(imageSrc: string) {
    this.imageSrc = imageSrc;
  }
}
