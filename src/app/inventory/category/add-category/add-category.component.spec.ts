import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { AddCategoryComponent } from './add-category.component';
import { CategoryRepositoryService } from '@app/core/services/category-repository.service';
import { setElementValueWithInputEvent } from "@shared/testing/common-utils";
import { AngularMaterialModule } from '@app/core/angular-material/angular-material.module';

describe('AddCategoryComponent', () => {
  let componentUnderTest: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let mockRepositoryService: CategoryRepositoryService;
  let componentNativeElement: HTMLElement;
  let nameInput: HTMLInputElement;
  let descriptionTextArea: HTMLTextAreaElement;
  let submitButton: HTMLButtonElement;

  beforeEach(async(() => {
    let mock = jasmine.createSpyObj("CategoryRepositoryService", ["addCategory"]);
    mock.addCategory.and.callFake((category) => {
      return of(category);
    });

    TestBed.configureTestingModule({
      declarations: [
        AddCategoryComponent
      ],
      imports: [
        ReactiveFormsModule,
        AngularMaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CategoryRepositoryService, useValue: mock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent);
    componentUnderTest = fixture.componentInstance;
    mockRepositoryService = fixture.debugElement.injector.get(CategoryRepositoryService);

    componentNativeElement = fixture.debugElement.nativeElement;
    nameInput = componentNativeElement.querySelector("form input[formControlName='name']");
    descriptionTextArea = componentNativeElement.querySelector("form textarea[formControlName='description']");
    submitButton = componentNativeElement.querySelector("form button[type='submit']");

    fixture.detectChanges();
  });

  it('Check that all expected elements are defined', () => {
    expect(nameInput).toBeTruthy();
    expect(descriptionTextArea).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('Submit button is disabled when name is empty', () => {
    expect(submitButton.disabled).toBe(true);
  });

  it('Submit button is enabled when name is not empty', () => {
    setElementValueWithInputEvent<HTMLInputElement>(nameInput, "a");
    fixture.detectChanges();

    expect(submitButton.disabled).toBe(false);
  });

  it('Clicking submit button calls service.addCategory', () => {
    setElementValueWithInputEvent<HTMLInputElement>(nameInput, "a");
    fixture.detectChanges();
    expect(mockRepositoryService.addCategory).not.toHaveBeenCalled();
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalled();
  });

  it('Submit sends correct name to be added', () => {
    setElementValueWithInputEvent<HTMLInputElement>(nameInput, "a");
    fixture.detectChanges();
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalledWith({
      id: "",
      name: "a",
      description: ""
    });
  });

  it('Submit sends correct description to be added', () => {
    setElementValueWithInputEvent<HTMLInputElement>(nameInput, "a");
    setElementValueWithInputEvent<HTMLTextAreaElement>(descriptionTextArea, "b");
    fixture.detectChanges();
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalledWith({
      id: "",
      name: "a",
      description: "b"
    });
  });

  it('Should not show the required error message at the start', () => {
    const errorElement = componentNativeElement.querySelector("mat-error");
    expect(errorElement).toBeNull();
  });

  it('Should show the required error message when name is dirty', () => {
    componentUnderTest.form.controls.name.markAsTouched();
    fixture.detectChanges();

    const errorElement = componentNativeElement.querySelector("mat-error");
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toMatch(/required/i);
  });
});