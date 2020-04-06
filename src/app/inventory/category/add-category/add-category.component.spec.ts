import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddCategoryComponent } from './add-category.component';
import { CategoryRepositoryService } from '@app/core/services/category-repository.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

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
        ReactiveFormsModule,
        CommonModule
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
    setNameInputValue("a");

    expect(submitButton.disabled).toBe(false);
  });

  function setNameInputValue(value: string) {
    nameInput.value = value;
    nameInput.dispatchEvent(newEvent('input'));
    fixture.detectChanges();
  }

  function newEvent(eventName: string, bubbles = false, cancelable = false) {
    let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
  }

  it('Clicking submit button calls service.addCategory', () => {
    setNameInputValue("a");
    expect(mockRepositoryService.addCategory).not.toHaveBeenCalled();
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalled();
  });

  it('Submit sends correct name to be added', () => {
    setNameInputValue("a");
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalledWith({
      id: "",
      name: "a",
      description: ""
    });
  });

  it('Submit sends correct description to be added', () => {
    setNameInputValue("a");
    setDescriptionTextAreaValue("b");
    submitButton.click();

    expect(mockRepositoryService.addCategory).toHaveBeenCalledWith({
      id: "",
      name: "a",
      description: "b"
    });
  });

  function setDescriptionTextAreaValue(value: string) {
    descriptionTextArea.value = value;
    descriptionTextArea.dispatchEvent(newEvent('input'));
    fixture.detectChanges();
  }
});