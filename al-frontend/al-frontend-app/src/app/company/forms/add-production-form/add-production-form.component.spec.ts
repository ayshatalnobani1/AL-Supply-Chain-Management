import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionFormComponent } from './add-production-form.component';

describe('AddProductionFormComponent', () => {
  let component: AddProductionFormComponent;
  let fixture: ComponentFixture<AddProductionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
