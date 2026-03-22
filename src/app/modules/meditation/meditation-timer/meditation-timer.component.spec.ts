import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeditationTimerComponent } from './meditation-timer.component';

describe('MeditationTimerComponent', () => {
  let component: MeditationTimerComponent;
  let fixture: ComponentFixture<MeditationTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeditationTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeditationTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
