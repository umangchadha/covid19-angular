import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictTableComponent } from './district-table.component';

describe('DistrictTableComponent', () => {
  let component: DistrictTableComponent;
  let fixture: ComponentFixture<DistrictTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
