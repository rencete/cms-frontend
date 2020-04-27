import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDataComponent } from './error-data.component';
import { AngularMaterialModule } from '@app/core/angular-material/angular-material.module';
import { ErrorData } from '@app/error/models/error-data.model';

describe('ErrorDataComponent', () => {
  let fixture: ComponentFixture<ErrorDataComponent>;
  let component: ErrorDataComponent;
  let componentNativeElement: HTMLElement;
  const expectedData: ErrorData = {
    id: "test-id",
    name: "Error Name",
    message: "This is a sample generated error."
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorDataComponent
      ],
      imports: [
        AngularMaterialModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDataComponent);
    component = fixture.componentInstance;
    componentNativeElement = fixture.debugElement.nativeElement;

    component.error = expectedData;

    fixture.detectChanges();
  });

  it('should display name', () => {
    const title = componentNativeElement.querySelector(".error-name");
    expect(title.textContent).toEqual(expectedData.name);
  });

  it('should display message', () => {
    const content = componentNativeElement.querySelector(".error-message");
    expect(content.textContent).toMatch(expectedData.message);
  });

  it('should emit event when click dismiss', (done) => {
    component.dismiss.subscribe(
      (id) => {
        expect(id).toEqual(expectedData.id);
        done();
      },
      (err) => {
        fail("Should not error");
      }
    );
    const dismissBtn = componentNativeElement.querySelector("button");
    dismissBtn.click();
    fixture.detectChanges();
  });
});
