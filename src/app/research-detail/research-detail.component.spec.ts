import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchDetailComponent } from './research-detail.component';

describe('ResearchDetailComponent', () => {
  let component: ResearchDetailComponent;
  let fixture: ComponentFixture<ResearchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
