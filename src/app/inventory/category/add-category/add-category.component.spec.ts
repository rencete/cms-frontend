import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddCategoryComponent } from './add-category.component';
import { CategoryRepositoryService } from '@app/core/services/category-repository.service';
import { setElementValueWithInputEvent } from "@shared/testing/common-utils";

describe('AddCategoryComponent', () => {
  let componentUnderTest: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;
  let mockRepositoryService: CategoryRepositoryService;
  let nameInput: HTMLInputElement;
  let descriptionTextArea: HTMLTextAreaElement;
  let submitButton: HTMLButtonElement;

  beforeEach(async(() => {
    let mock = jasmine.createSpyObj("CategoryRepositoryService", ["addCategory"]);

    TestBed.configureTestingModule({
      declarations: [
        AddCategoryComponent
      ],
      imports: [
        ReactiveFormsModule
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

    const componentNativeElement: HTMLElement = fixture.debugElement.nativeElement;
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
});