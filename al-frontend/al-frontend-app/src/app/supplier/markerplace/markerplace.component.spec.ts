import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerplaceComponent } from './markerplace.component';

describe('MarkerplaceComponent', () => {
  let component: MarkerplaceComponent;
  let fixture: ComponentFixture<MarkerplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      imports: [MarkerplaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
