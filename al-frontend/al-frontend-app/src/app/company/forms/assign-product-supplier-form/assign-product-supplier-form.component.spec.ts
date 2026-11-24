import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProductSupplierFormComponent } from './assign-product-supplier-form.component';

describe('AssignProductSupplierFormComponent', () => {
  let component: AssignProductSupplierFormComponent;
  let fixture: ComponentFixture<AssignProductSupplierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProductSupplierFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProductSupplierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
