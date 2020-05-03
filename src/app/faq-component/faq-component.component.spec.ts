import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqComponentComponent } from './faq-component.component';

describe('FaqComponentComponent', () => {
  let component: FaqComponentComponent;
  let fixture: ComponentFixture<FaqComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
