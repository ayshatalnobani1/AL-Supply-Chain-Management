import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProductWarehouseFormComponent } from './assign-product-warehouse-form.component';

describe('AssignProductWarehouseFormComponent', () => {
  let component: AssignProductWarehouseFormComponent;
  let fixture: ComponentFixture<AssignProductWarehouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProductWarehouseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProductWarehouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
