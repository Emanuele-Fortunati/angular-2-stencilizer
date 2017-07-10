import { Component } from '@angular/core';

@Component({
  selector: 'stencilizer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stencilizer';
  images: Array<string> = ['assets/young-emanuele-fortunati.png', 'assets/actual-emanuele-fortunati.png'];
  imageSrc: string = 'assets/young-emanuele-fortunati.png';
  selected: any = 0;

  onSelected(data: any) {
    if(data.image != null) {
      this.imageSrc = data.image;
    }

    this.selected = data.selected;
  }

  onCopySelected(selected: any) {

    this.selected = selected;

    if(this.images[this.selected]) {
      this.imageSrc = this.images[this.selected];
    }
  }

}
