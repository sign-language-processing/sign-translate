import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutDirectionComponent} from './about-direction.component';

describe('AboutDirectionComponent', () => {
  let component: AboutDirectionComponent;
  let fixture: ComponentFixture<AboutDirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutDirectionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
