import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementFormComponent } from './inventory-movement-form.component';

describe('InventoryMovementFormComponent', () => {
  let component: InventoryMovementFormComponent;
  let fixture: ComponentFixture<InventoryMovementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
