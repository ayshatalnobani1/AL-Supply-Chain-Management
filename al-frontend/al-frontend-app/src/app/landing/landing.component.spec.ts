import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('routes every sign-in button to login', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    buttons.forEach((button: HTMLButtonElement) => button.click());
    expect(navigate).toHaveBeenCalledTimes(3);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('links page sections to existing anchors without promoting signup', () => {
    const root: HTMLElement = fixture.nativeElement;
    for (const id of ['features', 'workspaces', 'about']) {
      expect(root.querySelector(`a[href="#${id}"]`)).toBeTruthy();
      expect(root.querySelector(`#${id}`)).toBeTruthy();
    }
    expect(root.textContent?.toLowerCase()).not.toContain('sign up');
  });
});
