import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionRecipeFormComponent } from './add-production-recipe-form.component';

describe('AddProductionRecipeFormComponent', () => {
  let component: AddProductionRecipeFormComponent;
  let fixture: ComponentFixture<AddProductionRecipeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductionRecipeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductionRecipeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
