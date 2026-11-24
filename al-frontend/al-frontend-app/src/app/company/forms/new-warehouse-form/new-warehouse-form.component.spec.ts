import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWarehouseFormComponent } from './new-warehouse-form.component';

describe('NewWarehouseFormComponent', () => {
  let component: NewWarehouseFormComponent;
  let fixture: ComponentFixture<NewWarehouseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWarehouseFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWarehouseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
