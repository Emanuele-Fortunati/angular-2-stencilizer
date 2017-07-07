import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStencilizerComponent } from './image-stencilizer.component';

describe('ImageStencilizerComponent', () => {
  let component: ImageStencilizerComponent;
  let fixture: ComponentFixture<ImageStencilizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageStencilizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageStencilizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
