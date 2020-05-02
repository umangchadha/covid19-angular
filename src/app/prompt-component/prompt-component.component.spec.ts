import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptComponentComponent } from './prompt-component.component';

describe('PromptComponentComponent', () => {
  let component: PromptComponentComponent;
  let fixture: ComponentFixture<PromptComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
