import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCopyComponent } from './dynamic-copy.component';

describe('DynamicCopyComponent', () => {
  let component: DynamicCopyComponent;
  let fixture: ComponentFixture<DynamicCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
